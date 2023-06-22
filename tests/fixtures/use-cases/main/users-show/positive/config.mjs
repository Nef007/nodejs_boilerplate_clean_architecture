import MainUsersShow from '../../../../../../lib/use-cases/main/users/Show.mjs'

export default {
    useCaseClass : MainUsersShow,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()

        const userId = users[0].id

        return { userId }
    }
}
