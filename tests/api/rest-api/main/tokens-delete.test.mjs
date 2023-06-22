import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder({ accessToken, refreshToken }) {
    return {
        method  : 'DELETE',
        url     : '/api/v1/logout/',
        headers : {
            'Authorization' : `Bearer ${accessToken}`,
            'Cookie'        : `refreshToken=${refreshToken}`
        }
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tokens-delete/positive`,
    'tokens-delete/positive',
    async ({ config: { before }, input, expected }) => {
        const tokens = await before(tester.factory)
        const token = tokens[input.email]

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(token),
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tokens-delete/negative`,
    'tokens-delete/negative',
    async ({ config: { before }, input, exception }) => {
        const tokens = await before(tester.factory)
        const token = tokens[input.email]

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(token),
            exception
        })
    }
)
