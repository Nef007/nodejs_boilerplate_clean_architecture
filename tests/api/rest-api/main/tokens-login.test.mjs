import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder(input) {
    return {
        method : 'POST',
        url    : '/api/v1/login',
        body   : input
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tokens-login/positive`,
    'tokens-login/positive',
    async ({ config: { before }, input, expected }) => {
        await before(tester.factory)

        await tester.testUseCasePositive({
            requestBuilder,
            input,
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tokens-login/negative`,
    'tokens-login/negative',
    async ({ config: { before }, input, exception }) => {
        await before(tester.factory)
        await tester.testUseCaseNegative({
            requestBuilder,
            input,
            exception
        })
    }
)
