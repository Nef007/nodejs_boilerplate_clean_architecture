import { Exception as X } from '../../../../packages.mjs'

import Base from '../../Base.mjs'
import { dumpTask } from '../../utils/dumps.mjs'
import Task from '../../../domain-model/Task.mjs'
import DMX from '../../../domain-model/X.mjs'

export default class MainTasksUpdate extends Base {
    static validationRules = {
        id          : [ 'required', 'uuid' ],
        shortName   : [ 'string', { 'max_length': 255 } ],
        description : [ 'string', { 'max_length': 255 } ],
        status      : [ { 'one_of': [ 'ACTIVE', 'ARCHIVE', 'PENDING' ] } ],
        userId      : [ 'uuid' ]
    }

    async execute({ id, ...data }) {
        try {
            const task = await Task.findById(id)

            const result = await task.update(data)

            return { data: dumpTask(result) }
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { [x.field]: 'WRONG_ID' }
                })
            }

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
