import MainTasksCreate from '../../../../../../lib/use-cases/main/tasks/Create.mjs'

export default {
    useCaseClass : MainTasksCreate,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()
        const tasks = await factory.setupTasks(users)

        const userId = users[0].id
        const taskId = tasks[0].id

        return { userId, taskId }
    }
}
