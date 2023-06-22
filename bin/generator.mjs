
import path                from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { docopt }          from '../packages.mjs'
// import JsonRpcGenerator    from './generator/JsonRpcGenerator.mjs';
import MigrationsGenerator from './generator/MigrationsGenerator.mjs'
import RestAPIGenerator    from './generator/RestAPIGenerator.mjs'
import UseCasesGenerator   from './generator/UseCasesGenerator.mjs'
import TestsGenerator      from './generator/TestsGenerator.mjs'


const doc =
`Usage:
    generate_usecases.js <path_to_model> [--namespace=<namespace>] [--actions=<actions>] [--actor=<actor>]
                                            [--override] [--migration] [--only=<only_layers_list>] [--ignore=<ignore_layers_list>]
    generate_usecases.js -h | --help

Options:
    <path_to_model>         Относительный путь к файлу модели Sequelize с экспортом по умолчанию.
    <namespace>             Название папки в use-cases. Default: 'main'.
    <actions>               Список действий CRUD, которые необходимо создать. Default: crudl (c = create, r = show, u = update, d = delete, l = list).
    <actor>                 Название модели Актера для запуска вариантов использования во время тестов. Default: 'User'.
    <only_layers_list>      Определите слои чистой архитектуры, которые вы хотите создать для модели, разделенной символом ','. Default: все будет сгенерировано:
                                - use-cases
                                - rest-api
                                - json-rpc
                                - test-fixtures
                                - test-use-cases
                                - test-rest-api
                                - test-json-rpc
                                [- tests (includes: test-fixtures, test-use-cases, test-rest-api, test-json-rpc)]
                                Пример: --only=use-cases,rest-api
    <ignore_layers_list>    Определите слои чистой архитектуры, которые вы хотите игнорировать для модели, разделенной на ','. Default: ''.
    -m --migration          Создать миграцию из модели.
    -o --override           Поставьте eсли вы хотите переопределить существующие файлы.
    -h --help               Показать этот экран.
`

main(docopt(doc))

async function main(opts) {
    const userConfig = await lazyImport(path.join(process.cwd(), 'generator.config.mjs'))

    // console.log('opts', opts)

    const namespace = opts['--namespace'] || userConfig.namespace || 'main'
    const override = opts['--override']
    const migration = opts['--migration']
    const actor = opts['--actor'] || 'User'
    const actions = opts['--actions'] || 'crudl'
    const config = { ...userConfig, namespace, override, actor }
    const options = { override, actor, migration, actions }

    const layers = getLayersList(opts)

    const modelPath = opts['<path_to_model>']
    const model = await loadModel(modelPath)

    const migrations = new MigrationsGenerator({ model, config, logger, modelPath })
    const useCases = new UseCasesGenerator({ model, config, logger })
    const restAPI = new RestAPIGenerator({ model, config, logger })
    // const jsonRPC = new JsonRpcGenerator({ model, config, logger });
    const tests = new TestsGenerator({ model, config, logger })

    await migrations.generate(options, layers)
    await useCases.generate(options, layers)
    await restAPI.generate(options, layers)
    // await jsonRPC.generate(options, layers);
    await tests.generate(options, layers)

    process.exit(0)
}

async function loadModel(modelPath) {
    try {
        return await lazyImport(path.posix.join(process.cwd(), modelPath))
    } catch (error) {
        logger.error(error.message)
        process.exit(1)
    }
}

async function lazyImport(pathToImport) {
    const importedModule = await import(pathToFileURL(pathToImport).href)

    return importedModule.default ? importedModule.default : importedModule
}

function getLayersList(opts) {
    const only = opts['--only']
    const ignore = opts['--ignore']

    const layers = {
        'use-cases'      : true,
        'rest-api'       : true,
        'json-rpc'       : true,
        'test-fixtures'  : true,
        'test-use-cases' : true,
        'test-rest-api'  : true
        // 'test-json-rpc'  : true
    }

    if (only) {
        const onlyLayers = only.split(',')

        for (const key of Object.keys(layers)) {
            layers[key] = layers[key] && onlyLayers.includes(key)
        }

        if (onlyLayers.includes('tests')) {
            layers['test-fixtures'] = true
            layers['test-use-cases'] = true
            layers['test-rest-api'] = true
            // layers['test-json-rpc'] = true;
        }
    }

    if (ignore) {
        const ignoreLayers = ignore.split(',')

        for (const key of Object.keys(layers)) {
            layers[key] = layers[key] && !ignoreLayers.includes(key)
        }

        if (ignoreLayers.includes('tests')) {
            layers['test-fixtures'] = false
            layers['test-use-cases'] = false
            layers['test-rest-api'] = false
            // layers['test-json-rpc'] = false;
        }
    }

    return layers
}

const logger = {
    error    : (...params) => console.log('\u001b[31m[Error]\u001b[0m', ...params),
    created  : (...params) => console.log('\u001b[32m[Created]\u001b[0m', ...params),
    skipped  : (...params) => console.log('\u001b[90m[Skipped]\u001b[0m', ...params),
    modified : (...params) => console.log('\u001b[36m[Modified]\u001b[0m', ...params),
    header   : (...params) => console.log('\n=== ', ...params, ' ===\n'),
    log      : console.log
}
