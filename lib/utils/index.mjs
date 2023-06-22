import { fileURLToPath } from 'url'
import { dirname }       from 'path'

export function getDirName(importMetaUrl) {
    return dirname(fileURLToPath(importMetaUrl))
}

export function cloneDeep(data) {
    return JSON.parse(JSON.stringify(data))
}
