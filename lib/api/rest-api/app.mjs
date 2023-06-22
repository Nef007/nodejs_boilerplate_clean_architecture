import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import https from 'https'
import express       from 'express'
import { promisify } from '../../../packages.mjs'
import logger        from '../logger.mjs'
import swaggerDocs from '../../../configs/swagger.js'
import middlewares   from './middlewares.mjs'
// import adminRouter   from './admin/router.mjs';
import mainRouter    from './main/routers/index.mjs'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Init app
const app = express()

app.use(middlewares.cors)
app.use(middlewares.json)
app.use(middlewares.cookieParser)
app.use(middlewares.clsMiddleware)
app.use(middlewares.urlencoded)
app.use(middlewares.include)


app.use('/api/v1', mainRouter)
//app.use('/', express.static(path.join(__dirname, '../../../client')))

let server = null


export function start({ appPort }) {
    const options = {
        // eslint-disable-next-line no-sync
        key  : fs.readFileSync('server.key'),
        // eslint-disable-next-line no-sync
        cert : fs.readFileSync('server.crt')
    }

    server = https.createServer(options, app).listen(appPort, () => {
        const { port, address } = server.address()

        swaggerDocs(app, appPort)

        global.REST_API_PORT = port
        logger.info(`[RestApiApp] STARTING AT PORT [${port}] ADDRESS [${address}]`)
    })

    server.closeAsync = promisify(server.close)
}

export async function stop() {
    if (!server) return
    logger.info('[RestApiApp] Closing server')
    await server.closeAsync()
}

export default app
