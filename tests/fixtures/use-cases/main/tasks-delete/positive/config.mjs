import MainTasksDelete from '../../../../../../lib/use-cases/main/tasks/Delete.mjs'

export default {
    useCaseClass : MainTasksDelete,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()
        const tasks = await factory.setupTasks(users)

        const userId = users[0].id
        const taskId = tasks[0].id

        return { userId, taskId }
    }
}
