import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tasks-show/positive`,
    'main/tasks-show/positive',
    async ({ config: { useCaseClass, before }, expected }) => {
        const { taskId } = await before(tester.factory)

        await tester.testUseCasePositive({ useCaseClass, input: { id: taskId },  expected })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tasks-show/negative`,
    'main/tasks-show/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory)
        await tester.testUseCaseNegative({ useCaseClass, input, exception })
    }
)
