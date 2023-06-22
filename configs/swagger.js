import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition : {
        openapi : '3.0.0',
        info    : {
            title       : 'SERVER API',
            description : 'API документация для SERVER на swagger',
            // contact     : {
            //     name  : 'Desmond Obisi',
            //     email : 'info@miniblog.com',
            //     url   : 'https://github.com/DesmondSanctity/node-js-swagger'
            // },
            version     : '1.0.0'
        },
        basePath : 'api/v1/',
        servers  : [
            {
                url         : 'https://localhost:8000/',
                description : 'Local server'
            }
            // {
            //     url         : '<your live url here>',
            //     description : 'Live server'
            // }
        ],
        components : {
            securitySchemes : {
                bearerAuth : {
                    type         : 'http',
                    scheme       : 'bearer',
                    bearerFormat : 'JWT'
                }
            }
        },
        security : [ {
            bearerAuth : []
        } ]
    },
    // looks for configuration in specified directories
    apis : [ './lib/**/*.mjs' ]
}
const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

export default swaggerDocs
