import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tokens-login/positive`,
    'main/tokens-login/positive',
    async ({ config: { useCaseClass, before }, input, expected }) => {
        await before(tester.factory)
        await tester.testUseCasePositive({ useCaseClass, input, expected })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tokens-login/negative`,
    'main/tokens-login/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory)
        await tester.testUseCaseNegative({ useCaseClass, input, exception })
    }
)
