import { Exception as X } from '../../../../packages.mjs'

import Base from '../../Base.mjs'
import { dumpTask } from '../../utils/dumps.mjs'
import Task from '../../../domain-model/Task.mjs'
import DMX from '../../../domain-model/X.mjs'

export default class MainTasksCreate extends Base {
    static validationRules = {
        shortName   : [ 'string', { 'max_length': 255 } ],
        description : [ 'string', { 'max_length': 255 } ],
        status      : [ { 'one_of': [ 'ACTIVE', 'ARCHIVE', 'PENDING' ] } ]
    }

    async execute(data) {
        try {
            const { userId } = this.context
            const task = await Task.create({ ...data, userId  })

            return  { data: dumpTask(task) }
        } catch (x) {
            if (x instanceof DMX.NotUnique) {
                throw new X({
                    code   : 'NOT_UNIQUE',
                    fields : { [x.field]: 'NOT_UNIQUE' }
                })
            }

            throw x
        }
    }
}
