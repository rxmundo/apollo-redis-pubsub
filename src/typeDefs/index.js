import { gql } from 'apollo-server-express'

const typeDefs = gql`
    type Query {
        users(query: String):[User!]!
    }

    type User{
        id: ID!
        name: String!
        email: String!
    }

    type Subscription {
        user: UserMutationSubPayload!
    }

    type UserMutationSubPayload{
        mutation: String!
        data: User!
    }

    type Mutation{
        createUser(name: String!, email: String!): User!
    }
`

export default typeDefs