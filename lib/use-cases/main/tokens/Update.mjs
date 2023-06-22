
import Base from '../../Base.mjs'
import Token from '../../../domain-model/Token.mjs'
import { Exception as X } from '../../../../packages.mjs'
import User from '../../../domain-model/User.mjs'
import config from '../../../config.cjs'
import { generateToken, verifyToken } from '../../utils/jwtUtils.mjs'

export default class TokensUpdate extends Base {
    static validationRules = {
        refreshToken : [ 'required', 'string' ]
    }


    async execute({ refreshToken }) {
        try {
            const userData = await verifyToken(refreshToken, config.refresh_token_secret)

            // const refreshTokenFromDb = Token.findOne({ where: { refreshToken } })
            const existingUser = await User.findByPk(userData.id, {
                include : {
                    model : Token,
                    as    : 'refreshToken'
                }
            })


            if (!existingUser.refreshToken.refreshToken) {
                throw new Error('WRONG_TOKEN')
            }


            const tokens = generateToken(existingUser)

            await Token.saveToken(existingUser.id, tokens.refreshToken)


            return {
                data : {
                    accessToken  : tokens.accessToken,
                    refreshToken : tokens.refreshToken
                }

            }
        } catch (x) {
            throw new X({
                code   : 'WRONG_TOKEN',
                fields : { token: 'WRONG_TOKEN' }
            })
        }
    }
}
