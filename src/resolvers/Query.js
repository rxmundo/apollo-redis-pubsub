const Query = {
    users: (_, _args, { data }) => {
        if (!_args.query) {
            return data.users
        }
        return data.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    }
}

export default Query