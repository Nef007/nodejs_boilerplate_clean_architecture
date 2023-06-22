import MainUsersList from '../../../../../../lib/use-cases/main/users/List.mjs'

export default {
    useCaseClass : MainUsersList,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()

        const userId = users[0].id

        return { userId }
    }
}
