import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tokens-me/positive`,
    'tokens-me/positive',
    async ({ config: { useCaseClass, before }, input, expected }) => {
        const tokens = await before(tester.factory)
        const { accessToken } = tokens[input.email]

        await tester.testUseCasePositive({ useCaseClass, input: { token: `Bearer ${accessToken}`  }, expected })
    }
)


tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tokens-me/negative`,
    'tokens-me/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        const tokens = await before(tester.factory)
        const { accessToken } = tokens[input.email]

        await tester.testUseCaseNegative({ useCaseClass, input: { token: `Bearer ${accessToken}`  }, exception })
    }
)
