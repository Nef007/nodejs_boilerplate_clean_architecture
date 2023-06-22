import jwt    from 'jsonwebtoken'
import config from '../../config.cjs'


// export function generateToken(object) {
//     const accessTokken = jwt.sign({ id: object.id }, config.secret, { expiresIn: '30m' })
//     const refreshToken = jwt.sign({ id: object.id }, config.secret, { expiresIn: '30d' })
//
//     return {
//         accessTokken,
//         refreshToken
//     }
// }
//
// export function verifyToken(token) {
//     return jwt.verify(token, config.secret)
// }


export function  generateToken(object) {
    // eslint-disable-next-line no-eval,security/detect-eval-with-expression
    const accessToken = jwt.sign({ id: object.id }, config.jwt_secret, { expiresIn: eval(config.session_expiry) })

    const refreshToken = jwt.sign(
        { id: object.id }, config.refresh_token_secret,
        // eslint-disable-next-line no-eval,security/detect-eval-with-expression
        { expiresIn: eval(config.refresh_token_expiry) }
    )

    return {
        accessToken,
        refreshToken
    }
}

export function  verifyToken(token, secret) {
    return jwt.verify(token, secret)
}
