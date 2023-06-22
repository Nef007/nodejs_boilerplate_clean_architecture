import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs'
import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder(taskId, token) {
    return {
        method  : 'DELETE',
        url     : `/api/v1/tasks/${taskId}`,
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tasks-delete/positive`,
    'tasks-delete/positive',
    async ({ config: { before }, expected }) => {
        const { taskId, userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(taskId, accessToken.accessToken),
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tasks-delete/negative`,
    'tasks-delete/negative',
    async ({ config: { before }, input, exception }) => {
        const { userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(input.id, accessToken.accessToken),
            exception
        })
    }
)
