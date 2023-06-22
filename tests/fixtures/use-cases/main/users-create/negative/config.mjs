import MainUsersCreate from '../../../../../../lib/use-cases/main/users/Create.mjs'

export default {
    useCaseClass : MainUsersCreate,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()
        const userId = users[0].id


        return { userId }
    }
}
