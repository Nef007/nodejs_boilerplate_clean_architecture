import util from 'util'

import Exception from './Exception.mjs'

import consoleLogger from './consoleLogger.mjs'

const statusCode = {
    'WRONG_ID'              : 404,
    'NOT_UNIQUE'            : 404,
    'USER_IS_BLOCKED'       : 403,
    'USER_NOT_FOUND'        : 404,
    'PERMISSION_DENIED'     : 403,
    'WRONG_TOKEN'           : 401,
    'FORMAT_ERROR'          : 404,
    'AUTHENTICATION_FAILED' : 401,
    'DEFAULT'               : 404

}


export async function runService(serviceClass, { context = {}, params = {}, logger = consoleLogger }) {
    // логируем входящие параметры, и время выполнения Service
    function logRequest(type, result, startTime) {
        logger(type, {
            service : serviceClass.name,
            runtime : Date.now() - startTime,
            // inspect - строковое представление, обьекта, наверно потому что в консоль выводим
            params  : util.inspect(params,  { showHidden: false, depth: null }),
            result
        })
    }

    const startTime = Date.now()

    try {
        const result = await new serviceClass({ context }).run(params)

        // Зачем JSON.stringify пока не понимаю
        logRequest('info', JSON.stringify(result), startTime)

        return result
    } catch (error) {
        const type = error instanceof Exception ? 'info' : 'error'

        logRequest(type, error, startTime)

        throw error
    }
}


export async function renderPromiseAsJson(req, res, promise, logger = consoleLogger) {
    // отдаем результат пользователю
    try {
        // дождаться выполнения, сервис выполняется асинхронно , но ответ мы должны дождаться
        const data = await promise

        // data.status = 1

        return res.send(data)
    } catch (error) {
        /* istanbul ignore next */
        if (error instanceof Exception) {
            // eslint-disable-next-line no-magic-numbers
            res.status(statusCode[error.code] || statusCode.DEFAULT).send({
                error : error.toHash()
            })
        } else {
            logger(
                'fatal',
                {
                    'REQUEST_URL'    : req.url,
                    'REQUEST_PARAMS' : req.params,
                    'REQUEST_BODY'   : req.body,
                    'ERROR_STACK'    : error.stack
                }
            )

            // eslint-disable-next-line no-magic-numbers
            res.status(500).send({
                error : {
                    code    : 'SERVER_ERROR',
                    message : 'Please, contact your system administartor!'
                }
            })
        }
    }
}


export function makeServiceRunner(
    serviceClass,
    paramsBuilder,
    contextBuilder,
    logger         = consoleLogger
) {
    // делаем ранер , запускаем сервис , преобразовываем req res , отдает ответ
    return async function serviceRunner(req, res) {
        // тут нет await потому что runService выполняется асинхронно хорошая оптимизация
        const resultPromise = runService(serviceClass, {
            // TODO: change
            // что изменить не понятно
            logger,
            params  : paramsBuilder(req, res),
            context : contextBuilder(req, res)
        })

        return renderPromiseAsJson(req, res, resultPromise, logger)
    }
}

