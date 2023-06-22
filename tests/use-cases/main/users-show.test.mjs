import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/users-show/positive`,
    'main/users-show/positive',
    async ({ config: { useCaseClass, before }, expected }) => {
        const { userId } = await before(tester.factory)

        await tester.testUseCasePositive({ useCaseClass, input: { id: userId }, context: { userId },  expected })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/users-show/negative`,
    'main/users-show/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory)
        await tester.testUseCaseNegative({ useCaseClass, input, exception })
    }
)
