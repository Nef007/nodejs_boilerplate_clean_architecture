import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs'
import { getDirName }    from '../../../../lib/utils/index.mjs'
import Tester            from '../../../lib/RestAPITester.mjs'

const tester = new Tester()

const dirname = getDirName(import.meta.url)

function requestBuilder(input, token) {
    let url = '/api/v1/tasks/?'

    for (const [ key, value ] of Object.entries(input)) {
        url += `${key}=${value}&`
    }

    return {
        method  : 'GET',
        url,
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    }
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/tasks-list/positive`,
    'tasks-list/positive',
    async ({ config: { before }, input, expected }) => {
        const { userId } = await before(tester.factory)
        const accessToken = generateToken({ id: userId })

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, accessToken.accessToken),
            input,
            expected
        })
    }
)
