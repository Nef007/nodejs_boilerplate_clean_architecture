import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs'
import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder(userId, token) {
    return {
        method  : 'DELETE',
        url     : `/api/v1/users/${userId}`,
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-delete/positive`,
    'users-delete/positive',
    async ({ config: { before }, expected }) => {
        const { userId } = await before(tester.factory)
        const tokens = generateToken({ id: userId })

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(userId, tokens.accessToken),
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-delete/negative`,
    'users-delete/negative',
    async ({ config: { before }, input, exception }) => {
        const { userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(input.id, accessToken.accessToken),
            exception
        })
    }
)
