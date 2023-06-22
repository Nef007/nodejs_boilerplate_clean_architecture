import KernelModule     from '../../../kernel/Kernel.mjs'
import logger           from '../logger.mjs'
import * as kernelUtils from './utils/kernelUtils.mjs'

function getLogger() {
    return (type, data) => logger[type](data)
}

const kernel = new KernelModule({
    defaultLogger : getLogger()
})

kernel.makeUseCaseRunner = kernelUtils.makeUseCaseRunner
kernel.runUseCase = kernelUtils.runUseCase

export default kernel
