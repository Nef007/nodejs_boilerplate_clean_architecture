import {
    Exception as X
} from '../../../../packages.mjs'

import Base from '../../Base.mjs'
import User from '../../../domain-model/User.mjs'
import Token from '../../../domain-model/Token.mjs'
import { generateToken } from '../../utils/jwtUtils.mjs'


export default class TokensCreate extends Base {
    static validationRules = {
        password : [ 'required', 'string' ],
        email    : [ 'required', 'email' ]
    }


    async execute(data) {
        const existingUser = await User.findOne({ where: { email: data.email } })

        if (!existingUser || !existingUser.checkPassword(data.password)) {
            throw new X({
                code   : 'AUTHENTICATION_FAILED',
                fields : {
                    email    : 'INVALID',
                    // eslint-disable-next-line more/no-hardcoded-password
                    password : 'INVALID'
                }
            })
        }

        if (existingUser.status !== 'ACTIVE') {
            throw new X({
                code   : 'AUTHENTICATION_FAILED',
                fields : {
                    status : 'NOT_ACTIVE_USER'
                }
            })
        }

        const { accessToken, refreshToken } = generateToken(existingUser)

        await Token.saveToken(existingUser.id, refreshToken)

        return {
            data : {
                accessToken,
                refreshToken
            }

        }
    }
}
