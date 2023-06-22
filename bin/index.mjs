import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { exec } from 'child_process'


async function lazyImport(pathToImport) {
    console.log(pathToFileURL(pathToImport))
    const importedModule = await import(pathToFileURL(pathToImport).href)

    return importedModule.default ? importedModule.default : importedModule
}


lazyImport('D:/Project/isori_server/tests/fixtures/use-cases/main/divisions-create/negative/config.mjs')
