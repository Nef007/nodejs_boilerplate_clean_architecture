import { Exception as X } from '../../../../packages.mjs'

import Base from '../../Base.mjs'
import Task from '../../../domain-model/Task.mjs'
import DMX from '../../../domain-model/X.mjs'

export default class MainTasksDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    }

    async execute({ id }) {
        try {
            const task = await Task.findById(id)

            await task.destroy()

            return { }
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { [x.field]: 'WRONG_ID' }
                })
            }

            throw x
        }
    }
}
