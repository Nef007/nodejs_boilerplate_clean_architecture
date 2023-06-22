import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tasks-create/positive`,
    'main/tasks-create/positive',
    async ({ config: { useCaseClass, before }, input, expected }) => {
        const { userId } = await before(tester.factory)

        await tester.testUseCasePositive({ useCaseClass, input, context: { userId }, expected })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tasks-create/negative`,
    'main/tasks-create/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        const { userId } = await before(tester.factory)

        await tester.testUseCaseNegative({ useCaseClass, input, context: { userId }, exception })
    }
)
