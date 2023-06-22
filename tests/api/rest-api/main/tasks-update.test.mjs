import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs'
import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder(input, taskId, token) {
    return {
        method  : 'PUT',
        url     : `/api/v1/tasks/${taskId}`,
        body    : input,
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tasks-update/positive`,
    'tasks-update/positive',
    async ({ config: { before }, expected, input }) => {
        const { taskId, userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, taskId, accessToken.accessToken),
            input,
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tasks-update/negative`,
    'tasks-update/negative',
    async ({ config: { before }, input, exception }) => {
        const { taskId, userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, input.id || taskId, accessToken.accessToken),
            input,
            exception
        })
    }
)
