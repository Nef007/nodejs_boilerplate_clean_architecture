import kernel from '../../kernel.mjs'

import MainTasksCreate from '../../../../use-cases/main/tasks/Create.mjs'
import MainTasksShow from '../../../../use-cases/main/tasks/Show.mjs'
import MainTasksUpdate from '../../../../use-cases/main/tasks/Update.mjs'
import MainTasksDelete from '../../../../use-cases/main/tasks/Delete.mjs'
import MainTasksList from '../../../../use-cases/main/tasks/List.mjs'

export default {
    create : kernel.makeUseCaseRunner(MainTasksCreate, req => req.body),
    show   : kernel.makeUseCaseRunner(MainTasksShow, req  => ({ id: req.params.id })),
    update : kernel.makeUseCaseRunner(MainTasksUpdate, req  => ({ ...req.body, id: req.params.id })),
    delete : kernel.makeUseCaseRunner(MainTasksDelete, req => ({ ...req.body, id: req.params.id })),
    list   : kernel.makeUseCaseRunner(MainTasksList, req => ({ ...req.query, ...req.params }))
}
