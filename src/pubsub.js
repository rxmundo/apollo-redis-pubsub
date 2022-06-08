import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'

const opts = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    retryStrategy: times => {
        // reconnect after
        return Math.min(times * 50, 2000);
      }
}

const pubsub = new RedisPubSub({
    publisher: new Redis(opts),
    subscriber: new Redis(opts),
    messageEventName: 'messageBuffer',
    pmessageEventName: 'pmessageBuffer',
})



export default pubsub