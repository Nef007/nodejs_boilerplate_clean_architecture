import fetch        from 'node-fetch'
import * as RestAPI from '../../lib/api/rest-api/app.mjs'

import Base from './BaseTester.mjs'

class RestAPITester extends Base {
    constructor(...params) {
        super(...params)

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        RestAPI.start({ appPort: 0 })
    }

    async testUseCasePositive({ requestBuilder, input = {}, expected = {} } = {}) {
        const apiPrefix = this.#getApiPrefix()

        async function useCaseRunner() {
            const request = requestBuilder(input)


            try {
                const response = await fetch(`${apiPrefix}${request.url}`, {
                    method  : request.method,
                    headers : {
                        ...(request.headers || {}),
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(request.body)
                })

                // console.log('RESPONSE', await response.json())

                return response.json()
            } catch (e) {
                console.log('ERROR', e)
            }
        }

        return this.testUseCasePositiveAbstract({
            useCaseRunner,
            expected : {
                ...expected
                // status : { is: 1 }

            }
        })
    }

    async testUseCaseNegative({ requestBuilder, input = {}, exception = {} } = {}) {
        const apiPrefix = this.#getApiPrefix()

        async function useCaseRunner() {
            const request = requestBuilder(input)
            const response = await fetch(`${apiPrefix}${request.url}`, {
                method  : request.method,
                headers : {
                    ...(request.headers || {}),
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(request.body)
            })

            return response.json()
        }

        return this.testUseCaseNegativeAbstract({
            useCaseRunner,
            exception : {
                //  status : 0
                error : exception
            }
        })
    }

    #getApiPrefix = () => {
        // global.REST_API_PORT is defined in RestAPI app.
        // TODO: better way is to import app and use server.address() to get the port
        return  `https://localhost:${global.REST_API_PORT}`
    }
}

export default RestAPITester
