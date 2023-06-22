import { getDirName } from '../../../lib/utils/index.mjs'
import Tester         from '../../lib/UseCaseTester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/tasks-list/positive`,
    'main/tasks-list/positive',
    async ({ config: { useCaseClass, before }, input, expected }) => {
        const { userId } =  await before(tester.factory)

        await tester.testUseCasePositive({ useCaseClass, input, context: { userId }, expected })
    }
)
