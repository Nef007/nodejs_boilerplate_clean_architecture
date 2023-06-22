import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs'
import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder(input, token) {
    return {
        method  : 'POST',
        url     : '/api/v1/tasks',
        body    : input,
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tasks-create/positive`,
    'tasks-create/positive',
    async ({ config: { before }, input, expected }) => {
        const { userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, accessToken.accessToken),
            input,
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tasks-create/negative`,
    'tasks-create/negative',
    async ({ config: { before }, input, exception }) => {
        const { userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, accessToken.accessToken),
            input,
            exception
        })
    }
)
