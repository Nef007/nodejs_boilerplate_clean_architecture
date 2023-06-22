import { Exception } from '../../../../packages.mjs'
import kernel        from '../kernel.mjs'


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

export async function runUseCase(useCaseClass, { context = {}, params = {}, logger = kernel.defaultLogger }) {
    function logRequest(type, result, startTime) {
        logger(type, {
            useCase : useCaseClass.name,
            runtime : Date.now() - startTime,
            params,
            result
        })
    }


    const startTime = Date.now()

    try {
        const result = await new useCaseClass({ context }).run(params)

        logRequest('info', result, startTime)

        return result
    } catch (error) {
        const type = error instanceof Exception ? 'warn' : 'error'

        logRequest(type, error, startTime)

        throw error
    }
}

export function makeUseCaseRunner(
    useCaseClass,
    paramsBuilder  = kernel.defaultParamsBuilder,
    contextBuilder = kernel.defaultContextBuilder,
    logger         = kernel.defaultLogger
) {
    return async function useCaseRunner(req, res) {
        const resultPromise = runUseCase(useCaseClass, {
            // TODO: change
            logger,
            params  : paramsBuilder(req, res),
            context : contextBuilder(req, res)
        })

        return renderPromiseAsJson(req, res, resultPromise, logger)
    }
}

async function renderPromiseAsJson(req, res, promise, logger = kernel.defaultLogger) {
    try {
        const data = await promise

        return res.send(data)
    } catch (error) {
        //  console.log(error)
        /* istanbul ignore next */
        if (error instanceof Exception) {
            // eslint-disable-next-line no-magic-numbers

            res.status(statusCode[error.code] || statusCode.DEFAULT).send({
                error : error.toHash()
            })
        } else {
            console.log(error)
            logger(
                'fatal',
                {
                    'REQUEST_URL'    : req.url,
                    'REQUEST_PARAMS' : req.params,
                    'REQUEST_BODY'   : req.body,
                    'ERROR_STACK'    : error.stack.split('\n')
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

