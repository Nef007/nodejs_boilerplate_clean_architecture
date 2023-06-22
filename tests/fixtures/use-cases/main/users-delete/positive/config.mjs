import MainUsersDelete from '../../../../../../lib/use-cases/main/users/Delete.mjs'

export default {
    useCaseClass : MainUsersDelete,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()

        const userId = users[0].id

        return { userId }
    }
}
