import kernel         from '../../kernel.mjs'
import TokensCreate from '../../../../use-cases/main/tokens/Create.mjs'
import TokensDelete from '../../../../use-cases/main/tokens/Delete.mjs'
import TokensCheck  from '../../../../use-cases/main/tokens/Check.mjs'
import TokensUpdate  from '../../../../use-cases/main/tokens/Update.mjs'
import { cloneDeep } from '../../../../utils/index.mjs'
import config from '../../../../config.cjs'


const COOKIE_OPTIONS = {
    httpOnly : true,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    secure   : true,
    signed   : false,
    // eslint-disable-next-line no-eval,security/detect-eval-with-expression,no-magic-numbers
    maxAge   : eval(config.refresh_token_expiry) * 1000,
    sameSite : 'none'
    // secret   : config.cookie_secret
}

export default {
    // create : kernel.makeUseCaseRunner(SessionsCreate, req => req.body),
    // delete : kernel.makeUseCaseRunner(SessionsDelete, req => cloneDeep(req.signedCookies)),
    // update : kernel.makeUseCaseRunner(SessionsUpdate, req => cloneDeep(req.cookies)),
    delete : async (req, res) => {
        const promise = kernel.runUseCase(TokensDelete, {
            params : cloneDeep({ refreshToken: req.cookies?.refreshToken })
        })

        try {
            const data = await promise

            res.clearCookie('refreshToken', COOKIE_OPTIONS)
            res.send(data)
        } catch (e) {
            console.log(e)

            return kernel.renderPromiseAsJson(req, res, promise)
        }
    },
    me : async (req, res) => {   // отправляет id клиенту из токена
        const promise = kernel.runUseCase(TokensCheck, {
            params : { token: req.headers.authorization }
        })

        try {
            const userData = await promise

            res.send(userData)
        } catch (e) {
            return kernel.renderPromiseAsJson(req, res, promise)
        }
    },
    update : async (req, res) => {
        const promise = kernel.runUseCase(TokensUpdate, {
            params : cloneDeep({ refreshToken: req.cookies?.refreshToken })
        })

        try {
            const { data } = await promise

            res.cookie('refreshToken', data.refreshToken, COOKIE_OPTIONS)
            res.send({ data })
        } catch (e) {
            return kernel.renderPromiseAsJson(req, res, promise)
        }
    },
    create : async (req, res) => {
        const promise = kernel.runUseCase(TokensCreate, {
            params : req.body
        })

        try {
            const { data } = await promise

            res.cookie('refreshToken', data.refreshToken, COOKIE_OPTIONS)
            res.send({ data })
        } catch (e) {
            return kernel.renderPromiseAsJson(req, res, promise)
        }
    },


    check : async (req, res, next) => {   // проверет токен перед задачей
        const promise = kernel.runUseCase(TokensCheck, {
            params : { token: req.headers.authorization }
        })

        try {
            const { data } = await promise

            /* eslint no-param-reassign: 0 */
            // eslint-disable-next-line require-atomic-updates
            req.session = {
                context : {
                    userId : data.id
                    // userStatus : userData.status
                }
            }

            return next()
        } catch (e) {
            return kernel.renderPromiseAsJson(req, res, promise)
        }
    }
}
