import MainTasksList from '../../../../../../lib/use-cases/main/tasks/List.mjs'

export default {
    useCaseClass : MainTasksList,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()
        const tasks = await factory.setupTasks(users)

        const userId = users[0].id
        const taskId = tasks[0].id

        return { userId, taskId }
    }
}
