import MainTokensUpdate from '../../../../../../lib/use-cases/main/tokens/Update.mjs'
import { generateToken } from '../../../../../../lib/use-cases/utils/jwtUtils.mjs'

export default {
    useCaseClass : MainTokensUpdate,
    before       : async (factory) => {
        await factory.standardSetup()
        const users = await factory.setupUsers()
        const tokens = {
            'email-for-worng-token' : 'wrong-token'
            //  'not-existing-email'    : generateToken({ id: '50f792b5-3478-4c59-be6e-b3ba665e0bf1' })
        }

        for (const user of users) {
            user.tokens = generateToken({ id: user.id })
        }

        await factory.setupTokens(users)

        for (const user of users) {
            tokens[user.email] = user.tokens
        }


        return tokens
    }
}
