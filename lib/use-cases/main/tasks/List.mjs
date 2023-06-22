import { Op } from '../../../../packages.mjs'

import Base from '../../Base.mjs'
import { dumpTask } from '../../utils/dumps.mjs'
import Task from '../../../domain-model/Task.mjs'

export default class MainTasksList extends Base {
    static validationRules = {
        search   : [ { 'min_length': 2 } ],
        limit    : [ 'positive_integer' ],
        offset   : [ 'integer', { 'min_number': 0 } ],
        sortedBy : [ { 'one_of': [ 'id', 'createdAt', 'updatedAt' ] } ],
        order    : [ { 'one_of': [ 'ASC', 'DESC' ] } ]
    }

    async execute({
        // eslint-disable-next-line no-magic-numbers
        limit    = 20,
        offset   = 0,
        search   = '',
        sortedBy = 'createdAt',
        order    = 'DESC'
    }) {
        const { userId } = this.context

        const searchFields = [ 'shortName', 'description' ]
        const findQuery = search
            ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.like]: `%${ search }%` } })) }
            : {}

        const dbRequest = {
            where : { ...findQuery, userId },
            order : [ [ sortedBy, order ] ],
            limit,
            offset
        }

        const [ tasks, filteredCount, totalCount ] = await Promise.all([
            Task.findAll(dbRequest),
            Task.count({ where: { ...findQuery, userId } }),
            Task.count({ where: { userId } })
        ])

        const data = tasks.map(dumpTask)

        return {
            data,
            meta : {
                totalCount,
                filteredCount,
                limit,
                offset
            }
        }
    }
}
