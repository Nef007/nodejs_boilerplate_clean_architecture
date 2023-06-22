import {
    Exception as X
} from '../../../../packages.mjs'

import Base         from '../../Base.mjs'
import { dumpUser } from '../../utils/dumps.mjs'
import User         from '../../../domain-model/User.mjs'
import DMX          from '../../../domain-model/X.mjs'

export default class UsersUpdate extends Base {
    static validationRules = {
        id         : [  'required', 'uuid' ],
        email      : [  'email', { 'max_length': 255 }, 'to_lc' ],
        firstName  : [  'string' ],
        secondName : [  'string' ],
        patronymic : [  'string' ]
    }

    async execute({ id, ...data }) {
        try {
            const { userId } = this.context

            // разрешить менять данные только самому себе
            if (id !== userId) {
                throw new X({
                    code   : 'PERMISSION_DENIED',
                    fields : { token: 'WRONG_TOKEN' }
                })
            }

            const user = await User.findById(id)

            const result = await user.update(data)

            return { data: dumpUser(result) }
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
