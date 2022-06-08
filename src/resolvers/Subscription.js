
// import pubsub from '../pubsub'

const Subscription = {
    user: {
        subscribe: (_parent, _args, { pubsub }) => {
            return pubsub.asyncIterator(['USER'])
        },
    }
}

export default Subscription