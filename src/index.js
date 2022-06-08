import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer } from 'http'

import data from './data'
import pubsub from './pubsub'
import * as resolvers from './resolvers'
import typeDefs from './typeDefs'

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

;(async function(){
    try {
        const app = express();   
        const httpServer = createServer(app)
        const wsServer = new WebSocketServer({
            server: httpServer,
            path: '/graphql'
        })
        
        const serverCleanup = useServer(
            {
                schema,
                context: (wsCtx, msg, args ) => {
                    /*
                    wsCtx contains websocket contextsuch as:
                        subscriptions: { ... }
                        connectionParams: {
                            //headers stuff here
                        }
                    */
                    // can implement dynamic contex such as checking  for user auth, etc...
                    return { pubsub }
                },
                onConnect: async (wsCtx) => {
                    console.log('client connected')
                },
                onDisconnect: async (wsCtx, code, reason) => {
                    console.log(`client disconnected: [${code}] ${reason}`)
                }
            }, 
            wsServer
            )
        
        const server = new ApolloServer({ 
            schema,
            csrfPrevention: true,
            plugins: [
                // add http server cleanup
                ApolloServerPluginDrainHttpServer({ httpServer }),
                // add WebSocket server cleanup
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                            await serverCleanup.dispose();
                            },
                        };
                    },
                },
            ],    
            context: ({}) => ({
                data,
                pubsub
            })
        });
        
        await server.start()
        server.applyMiddleware({ app })
        
        
        const port = process.env.PORT || 4000
        httpServer.listen(port, () => {
            console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
        })
      
    } catch (err) {
        console.error(err)
    }
})()