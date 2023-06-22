import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tasks-update/positive`,
    'main/tasks-update/positive',
    async ({ config: { useCaseClass, before }, expected, input }) => {
        const { taskId } = await before(tester.factory)

        await tester.testUseCasePositive({
            useCaseClass,
            input : { ...input, id: taskId },
            expected
        })
    }
)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tasks-update/negative`,
    'main/tasks-update/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        const { taskId } = await before(tester.factory)

        await tester.testUseCaseNegative({
            useCaseClass,
            input : { ...input, id: input.id || taskId },
            exception
        })
    }
)
