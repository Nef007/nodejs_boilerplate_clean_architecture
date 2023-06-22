import MainTasksShow from '../../../../../../lib/use-cases/main/tasks/Show.mjs'

export default {
    useCaseClass : MainTasksShow,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()
        const tasks = await factory.setupTasks(users)

        const userId = users[0].id
        const taskId = tasks[0].id

        return { userId, taskId }
    }
}
