import Base from '../../Base.mjs'
import Token from '../../../domain-model/Token.mjs'

export default class TokensDelete extends Base {
    static validationRules = {
        refreshToken : [ 'required', 'string' ]
    }

    async execute({ refreshToken }) {
        const token = await Token.findOne({ where: { refreshToken } })

        if (token) {
            await token.destroy()
        }

        // await token.destroy()

        return { }
    }
}
