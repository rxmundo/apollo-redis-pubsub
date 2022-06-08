import { v4 } from 'uuid'
import { ApolloError } from 'apollo-server-errors'

const Mutation = {
    createUser(parent, args, { data, pubsub }) {
        const isEmailExists = data.users.some((user) => user.email === args.email)
        if (isEmailExists) {
            throw new ApolloError(
                `'${args.email}' already taken.`,
                'EMAIL_EXISTS')
        }
        const { name, email } = args
        const user = {
            id: v4(),
            name,
            email,
        }
        pubsub.publish('USER', {
            user: {
                mutation: 'CREATED',
                data: user
            }
        });

        data.users.push(user);
        return user
    },
}

export default Mutation