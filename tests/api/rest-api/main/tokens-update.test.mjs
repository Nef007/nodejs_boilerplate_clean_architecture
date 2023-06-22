import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder({ accessToken, refreshToken }) {
    return {
        method  : 'PUT',
        url     : '/api/v1/refresh',
        body    : {},
        headers : {
            'Authorization' : `Bearer ${accessToken}`,
            'Cookie'        : `refreshToken=${refreshToken}`
        }
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tokens-update/positive`,
    'tokens-update/positive',
    async ({ config: { before }, expected, input }) => {
        const tokens = await before(tester.factory)
        const token = tokens[input.email]

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(token),
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tokens-update/negative`,
    'tokens-update/negative',
    async ({ config: { before }, input, exception }) => {
        const tokens = await before(tester.factory)
        const token = tokens[input.email]

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(token),
            exception
        })
    }
)
