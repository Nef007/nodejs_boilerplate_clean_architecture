import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tokens-update/positive`,
    'main/tokens-update/positive',
    async ({ config: { useCaseClass, before }, input, expected }) => {
        const tokens = await before(tester.factory)
        const { refreshToken } = tokens[input.email]

        await tester.testUseCasePositive({ useCaseClass, input: { refreshToken }, expected })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tokens-update/negative`,
    'main/tokens-update/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        const tokens = await before(tester.factory)
        const refreshToken = tokens[input.email]

        await tester.testUseCaseNegative({ useCaseClass, input: {  refreshToken }, exception })
    }
)
