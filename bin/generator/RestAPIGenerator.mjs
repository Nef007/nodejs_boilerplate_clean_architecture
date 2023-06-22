import path from 'path'
import Base from './BaseGenerator.mjs'


class RestAPIGenerator extends Base {
    constructor({ model, config, logger }) {
        super({ model, config, logger })

        this.folders = {
            templates   : path.posix.join(config.templatesFolder, 'rest-api'),
            controllers : path.posix.join(config.apiFolder, config.namespace, 'controllers'),
            routers     : path.posix.join(config.apiFolder, config.namespace, 'routers'),
            usecases    : path.posix.join(config.usecasesFolder, config.namespace, this.modelNames.plural_lcc),
            api         : path.posix.join(config.apiFolder, config.namespace),
            apiBase     : config.apiFolder
        }

        this.files = {
            // router                   : path.posix.join(this.folders.api, 'router.mjs'),
            router                   : path.posix.join(this.folders.routers, `${this.modelNames.plural_lcc}.mjs`),
            controller               : path.posix.join(this.folders.controllers, `${this.modelNames.plural_lcc}.mjs`),
            controllersIndex         : path.posix.join(this.folders.controllers, 'index.mjs'),
            routersIndex             : path.posix.join(this.folders.routers, 'index.mjs'),
            controllersIndexTemplate : path.posix.join(this.folders.templates, 'controllerIndex'),
            routersIndexTemplate     : path.posix.join(this.folders.templates, 'routerIndex'),
            routerTemplate           : path.posix.join(this.folders.templates, 'router')
            // routesTemplate           : path.posix.join(this.folders.templates, 'routes')
        }
    }

    async generate(options, layers) {
        if (!layers['rest-api']) return
        this.logger.header('Generate API')

        this.logger.log('Controllers:')
        await this.#generateController(options)
        await this.#generateControllerIndex(options)

        this.logger.log('\nRouter:')
        await this.#generateRouter(options)
        await this.#generateRouterIndex(options)
    }

    #generateController = async ({ override, actions } = {}) => {
        await this.createFolderIfNotExists(this.folders.controllers)
        if (!override && this.fileExists(this.files.controller)) {
            this.logger.skipped(this.files.controller)
        } else {
            const controllerTemplate = this.#getContrrollerTemplate({ actions })

            const controllerFileString = this.fillTemplateWithData(controllerTemplate, {
                'MODEL_NAME_NAMESPACED'  : this.modelNames.namespaced_plural,
                // Paths
                'USECASES_RELATIVE_PATH' : path.posix.relative(this.folders.controllers, this.folders.usecases),
                'API_RELATIVE_PATH'      : path.posix.relative(this.folders.controllers, this.folders.apiBase)
            })

            await this.writeFileAndFixEslint(this.files.controller, controllerFileString)
            this.logger.created(this.files.controller)
        }
    }

    #generateRouter = async ({ override, actions } = {}) => {
        await this.createFolderIfNotExists(this.folders.routers)
        if (!override && this.fileExists(this.files.router)) {
            this.logger.skipped(this.files.router)
        } else {
            const routesTemplateString = this.#getRoutesTemplate({ actions })
            const routerString = this.fillTemplateWithData(routesTemplateString, {
                'MODEL_NAME_PLURAL'       : this.modelNames.plural,
                'MODEL_NAME_ORIGINAL'     : this.modelNames.original,
                'MODEL_NAME_PLURAL_toLCC' : this.modelNames.plural_lcc
            })

            await this.writeFileAndFixEslint(this.files.router, routerString)
            this.logger.created(this.files.router)
        }
    }

    #getContrrollerTemplate = ({ actions : _actions }) => {
        const actionsMap = {
            'c' : 'Create',
            'r' : 'Show',
            'u' : 'Update',
            'd' : 'Delete',
            'l' : 'List'
        }
        const paramsBuilderMap = {

            // eslint-disable-next-line more/no-hardcoded-configuration-data
            'Create' : 'req => req.body',
            // eslint-disable-next-line more/no-hardcoded-configuration-data
            'Show'   : 'req  => ({ id: req.params.id })',
            // eslint-disable-next-line more/no-hardcoded-configuration-data
            'Update' : 'req  => ({ ...req.body, id: req.params.id })',
            // eslint-disable-next-line more/no-hardcoded-configuration-data
            'Delete' : 'req => ({ ...req.body, id: req.params.id })',
            // eslint-disable-next-line more/no-hardcoded-configuration-data
            'List'   : 'req => ({ ...req.query, ...req.params })'
        }

        const actions = _actions.split('').map(action => actionsMap[action])

        // eslint-disable-next-line more/no-hardcoded-configuration-data
        let template = 'import kernel from \'{{API_RELATIVE_PATH}}/kernel.mjs\';\n\n'

        for (const action of actions) {
            template += `import {{MODEL_NAME_NAMESPACED}}${action} from '{{USECASES_RELATIVE_PATH}}/${action}.mjs';\n`
        }

        template += '\nexport default {\n'

        for (const action of actions) {
            template += `${action.toLowerCase()} : kernel.makeUseCaseRunner({{MODEL_NAME_NAMESPACED}}${action}, ${paramsBuilderMap[action]}),\n`
        }

        template += '};\n'

        return template
    }


    #generateControllerIndex = async () => {
        await this.copyFileIfNotExists(this.files.controllersIndex, this.files.controllersIndexTemplate)
        const controllersIndexString = await this.readFileString(this.files.controllersIndex)
        const modelName = this.modelNames.plural_lcc

        if (controllersIndexString.includes(`'./${modelName}.mjs'`)) {
            this.logger.skipped(this.files.controllersIndex)
        } else {
            const lines = controllersIndexString.split(/\r?\n/)

            let fileString = `import ${modelName} from './${modelName}.mjs';\n`

            for (const line of lines) {
                fileString += `${line}\n`
                if (line.includes('export default')) {
                    fileString += `${modelName},\n`
                }
            }

            fileString = fileString.trim()

            await this.writeFileAndFixEslint(this.files.controllersIndex, fileString)
            this.logger.modified(this.files.controllersIndex)
        }
    }

    #generateRouterIndex = async () => {
        await this.copyFileIfNotExists(this.files.routersIndex, this.files.routersIndexTemplate)
        const routesIndexString = await this.readFileString(this.files.routersIndex)
        const modelName = this.modelNames.plural_lcc

        if (routesIndexString.includes(`'./${modelName}.mjs'`)) {
            this.logger.skipped(this.files.routersIndex)
        } else {
            const lines = routesIndexString.split(/\r?\n/)

            let fileString = `import ${modelName} from './${modelName}.mjs';\n`

            for (const line of lines) {
                fileString += `${line}\n`
                if (line.includes('const router = express.Router()')) {
                    fileString += `router.use(${modelName})\n`
                }
            }

            fileString = fileString.trim()

            await this.writeFileAndFixEslint(this.files.routersIndex, fileString)
            this.logger.modified(this.files.routersIndex)
        }
    }

    // #generateRouter = async ({ actions }) => {
    //     await this.copyFileIfNotExists(this.files.router, this.files.routerTemplate)
    //     const routerFileString = await this.readFileString(this.files.router)
    //
    //     if (routerFileString.includes(`// ${this.modelNames.plural}`)) {
    //         this.logger.skipped(this.files.router)
    //     } else {
    //         const routesTemplateString = this.#getRoutesTemplate({ actions })
    //         const routerString = this.fillTemplateWithData(routesTemplateString, {
    //             'MODEL_NAME_PLURAL'       : this.modelNames.plural,
    //             'MODEL_NAME_PLURAL_toLCC' : this.modelNames.plural_lcc
    //         })
    //
    //         await this.writeFileAndFixEslint(this.files.router, routerString, 'append')
    //         this.logger.modified(this.files.router)
    //     }
    // }

    // eslint-disable-next-line max-lines-per-function
    #getRoutesTemplate = ({ actions }) => {
        let template = 'import express     from \'express\'\n' +
            'import controllers from \'../controllers/index.mjs\'\n' +
            '\n' +
            'const router = express.Router()\n' +
            'const checkSession = controllers.sessions.check' +
            '\n// {{MODEL_NAME_PLURAL}}\n' +
            '\n' +
            '/**\n' +
            ' * @swagger\n' +
            ' * components:\n' +
            ' *   schemas:\n' +
            ' *     Error500:\n' +
            ' *       type: object\n' +
            ' *       properties:\n' +
            ' *            error:\n' +
            ' *              type: object\n' +
            ' *              properties:\n' +
            ' *                  message:\n' +
            ' *                      type: string\n' +
            ' *                      default: Please, contact your system administartor!\n' +
            ' *                  code:\n' +
            ' *                     type: string\n' +
            ' *                     default: SERVER_ERROR\n' +
            ' */\n' +
            '\n' +
            '/**\n' +
            ' * @swagger\n' +
            ' * components:\n' +
            ' *   schemas:\n' +
            ' *     Error400:\n' +
            ' *        type: object\n' +
            ' *        properties:\n' +
            ' *             error:\n' +
            ' *               type: object\n' +
            ' *               properties:\n' +
            ' *                  fields:\n' +
            ' *                     type: object\n' +
            ' *                     properties:\n' +
            ' *                          <property>:\n' +
            ' *                             type: string\n' +
            ' *                             default: REQUIRED\n' +
            ' *                  code:\n' +
            ' *                     type: string\n' +
            ' *                     default: FORMAT_ERROR\n' +
            ' */\n' +
            '\n' +
            '/**\n' +
            ' * @swagger\n' +
            ' * components:\n' +
            ' *   schemas:\n' +
            ' *     Error401:\n' +
            ' *        type: object\n' +
            ' *        properties:\n' +
            ' *             error:\n' +
            ' *               type: object\n' +
            ' *               properties:\n' +
            ' *                  fields:\n' +
            ' *                     type: object\n' +
            ' *                     properties:\n' +
            ' *                          email:\n' +
            ' *                             type: string\n' +
            ' *                             default: INVALID\n' +
            ' *                          password:\n' +
            ' *                             type: string\n' +
            ' *                             default: INVALID\n' +
            ' *                  code:\n' +
            ' *                     type: string\n' +
            ' *                     default: AUTHENTICATION_FAILED\n' +
            ' */\n' +
            '\n' +
            '/**\n' +
            ' * @swagger\n' +
            ' * components:\n' +
            ' *   schemas:\n' +
            ' *     {{MODEL_NAME_ORIGINAL}}Base:\n' +
            ' *       type: object\n' +
            ' *       required:\n' +
            ' *              - add_prorerty\n' +
            ' *       properties:\n' +
            ' *              add_prorerty:\n' +
            ' *                 type: string\n' +
            ' */\n' +
            '\n' +
            '\n' +
            '/**\n' +
            ' * @swagger\n' +
            ' * components:\n' +
            ' *   schemas:\n' +
            ' *     {{MODEL_NAME_ORIGINAL}}Out:\n' +
            ' *        properties:\n' +
            ' *          data:\n' +
            ' *            type: object\n' +
            ' *            allOf:\n' +
            ' *             - type: object\n' +
            ' *               properties:\n' +
            ' *                id:\n' +
            ' *                  type: string\n' +
            ' *                  required: true\n' +
            ' *             - $ref: \'#/components/schemas/{{MODEL_NAME_ORIGINAL}}Base\'\n' +
            ' */\n'

        const actionsMap = {
            'c' :
                '/**\n' +
                ' * @swagger\n' +
                ' * /api/v1/{{MODEL_NAME_PLURAL_toLCC}}:\n' +
                ' *   post:\n' +
                ' *     summary: Создание {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     tags:\n' +
                ' *     - {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     requestBody:\n' +
                ' *      required: true\n' +
                ' *      content:\n' +
                ' *        application/json:\n' +
                ' *          schema:\n' +
                ' *            allOf:\n' +
                ' *              - $ref: \'#/components/schemas/{{MODEL_NAME_ORIGINAL}}Base\'\n' +
                ' *     responses:\n' +
                ' *       200:\n' +
                ' *         description: Созданный {{MODEL_NAME_ORIGINAL}}\n' +
                ' *         content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *                $ref: \'#/components/schemas/{{MODEL_NAME_ORIGINAL}}Out\'\n' +
                ' *       400:\n' +
                ' *        description: Ошибка данных\n' +
                ' *        content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *               $ref: \'#/components/schemas/Error400\'\n' +
                ' *       500:\n' +
                ' *          description: Ошибка сервера\n' +
                ' *          content:\n' +
                ' *           application/json:\n' +
                ' *            schema:\n' +
                ' *                 $ref: \'#/components/schemas/Error500\'\n' +
                ' */\n' +
                'router.post(\'/{{MODEL_NAME_PLURAL_toLCC}}\',       checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.create)\n',
            'r' :
                '/**\n' +
                ' * @swagger\n' +
                ' * /api/v1/{{MODEL_NAME_PLURAL_toLCC}}/{id}:\n' +
                ' *   get:\n' +
                ' *     summary: Получение {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     tags:\n' +
                ' *     - {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     parameters:\n' +
                ' *         - in: path\n' +
                ' *           name: id\n' +
                ' *           schema:\n' +
                ' *             type: string\n' +
                ' *           required: true\n' +
                ' *     responses:\n' +
                ' *       200:\n' +
                ' *         description: Возвращается {{MODEL_NAME_ORIGINAL}}\n' +
                ' *         content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *               $ref: \'#/components/schemas/{{MODEL_NAME_ORIGINAL}}Out\'\n' +
                ' *       400:\n' +
                ' *        description: Ошибка данных\n' +
                ' *        content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *               $ref: \'#/components/schemas/Error400\'\n' +
                ' *       500:\n' +
                ' *          description: Ошибка сервера\n' +
                ' *          content:\n' +
                ' *           application/json:\n' +
                ' *            schema:\n' +
                ' *                 $ref: \'#/components/schemas/Error500\'\n' +
                ' */\n' +
                'router.get(\'/{{MODEL_NAME_PLURAL_toLCC}}/:id\',    checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.show)\n',
            'u' : '/**\n' +
                ' * @swagger\n' +
                ' * /api/v1/{{MODEL_NAME_PLURAL_toLCC}}/{id}:\n' +
                ' *   put:\n' +
                ' *     summary: Обновление {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     tags:\n' +
                ' *     - {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     parameters:\n' +
                ' *         - in: path\n' +
                ' *           name: id\n' +
                ' *           schema:\n' +
                ' *             type: string\n' +
                ' *           required: true\n' +
                ' *     requestBody:\n' +
                ' *      required: true\n' +
                ' *      content:\n' +
                ' *        application/json:\n' +
                ' *          schema:\n' +
                ' *            allOf:\n' +
                ' *              - $ref: \'#/components/schemas/{{MODEL_NAME_ORIGINAL}}Base\'\n' +
                ' *     responses:\n' +
                ' *       200:\n' +
                ' *         description: Возвращается обновленный {{MODEL_NAME_ORIGINAL}}\n' +
                ' *         content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *               $ref: \'#/components/schemas/{{MODEL_NAME_ORIGINAL}}Out\'\n' +
                ' *       400:\n' +
                ' *        description: Ошибка данных\n' +
                ' *        content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *               $ref: \'#/components/schemas/Error400\'\n' +
                ' *       500:\n' +
                ' *          description: Ошибка сервера\n' +
                ' *          content:\n' +
                ' *           application/json:\n' +
                ' *            schema:\n' +
                ' *                 $ref: \'#/components/schemas/Error500\'\n' +
                ' */\n' +
                'router.put(\'/{{MODEL_NAME_PLURAL_toLCC}}/:id\',    checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.update)\n',
            'd' : '/**\n' +
                ' * @swagger\n' +
                ' * /api/v1/{{MODEL_NAME_PLURAL_toLCC}}/{id}:\n' +
                ' *   delete:\n' +
                ' *     summary: Удаление  {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     tags:\n' +
                ' *     -  {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     parameters:\n' +
                ' *         - in: path\n' +
                ' *           name: id\n' +
                ' *           schema:\n' +
                ' *             type: string\n' +
                ' *           required: true\n' +
                ' *     responses:\n' +
                ' *       200:\n' +
                ' *         description: Успешно\n' +
                ' *       400:\n' +
                ' *        description: Ошибка данных\n' +
                ' *        content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *               $ref: \'#/components/schemas/Error400\'\n' +
                ' *       500:\n' +
                ' *          description: Ошибка сервера\n' +
                ' *          content:\n' +
                ' *           application/json:\n' +
                ' *            schema:\n' +
                ' *                 $ref: \'#/components/schemas/Error500\'\n' +
                ' */\n' +
                'router.delete(\'/{{MODEL_NAME_PLURAL_toLCC}}/:id\', checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.delete)\n',
            'l' :
                '/**\n' +
                ' * @swagger\n' +
                ' * /api/v1/{{MODEL_NAME_PLURAL_toLCC}}/:\n' +
                ' *   get:\n' +
                ' *     summary: Получить список {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     tags:\n' +
                ' *     - {{MODEL_NAME_ORIGINAL}}\n' +
                ' *     parameters:\n' +
                ' *        - in: query\n' +
                ' *          name: search\n' +
                ' *          schema:\n' +
                ' *            type: string\n' +
                ' *        - in: query\n' +
                ' *          name: limit\n' +
                ' *          schema:\n' +
                ' *            type: number\n' +
                ' *            default: 20\n' +
                ' *        - in: query\n' +
                ' *          name: offset\n' +
                ' *          schema:\n' +
                ' *            type: number\n' +
                ' *            default: 0\n' +
                ' *        - in: query\n' +
                ' *          name: sortedBy\n' +
                ' *          schema:\n' +
                ' *            type: string\n' +
                ' *            default: createdAt\n' +
                ' *        - in: query\n' +
                ' *          name: order\n' +
                ' *          schema:\n' +
                ' *            type: string\n' +
                ' *            enum: [ASC, DESC]\n' +
                ' *            default: DESC\n' +
                ' *     responses:\n' +
                ' *       200:\n' +
                ' *         content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *              type: object\n' +
                ' *              properties:\n' +
                ' *                 data:\n' +
                ' *                   type: array\n' +
                ' *                   items:\n' +
                ' *                     $ref: \'#/components/schemas/UserOut\'\n' +
                ' *                 meta:\n' +
                ' *                   type: object\n' +
                ' *                   properties:\n' +
                ' *                      totalCount:\n' +
                ' *                         type: number\n' +
                ' *                      filteredCount:\n' +
                ' *                         type: number\n' +
                ' *                      limit:\n' +
                ' *                         type: number\n' +
                ' *                      offset:\n' +
                ' *                         type: number\n' +
                ' *       400:\n' +
                ' *        description: Ошибка данных\n' +
                ' *        content:\n' +
                ' *          application/json:\n' +
                ' *            schema:\n' +
                ' *               $ref: \'#/components/schemas/Error400\'\n' +
                ' *       500:\n' +
                ' *          description: Ошибка сервера\n' +
                ' *          content:\n' +
                ' *           application/json:\n' +
                ' *            schema:\n' +
                ' *                 $ref: \'#/components/schemas/Error500\'\n' +
                ' */\n' +
                'router.get(\'/{{MODEL_NAME_PLURAL_toLCC}}\',        checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.list)'
        }

        for (const action of actions) {
            template += `${actionsMap[action]}\n`
        }

        template += 'export default router\n'


        return template
    }
}

export default RestAPIGenerator
