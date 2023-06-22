import livr2 from 'livr'
import Exception from './Exception.mjs'

class ServiceBase {
    constructor(args) {
        if (!args.context) throw new Error('CONTEXT_REQUIRED')
        this.context = args.context
    }

    async run(params) {
        const _this = this
        // Старый код
        // return _asyncToGenerator(function* () {
        //     if (typeof _this.checkPermissions === 'function') {
        //         yield _this.checkPermissions()
        //     }
        //
        //     const cleanParams = yield _this.validate(params)
        //
        //     return _this.execute(cleanParams)
        // })()

        if (typeof _this.checkPermissions === 'function') {
            //  Мой комент:  что за права доступа проверяются, я пока не понял
            await _this.checkPermissions()
        }


        const  cleanParams = await _this.validate(params)

        return _this.execute(cleanParams)
    }

    validate(data) {
        // Старый комент:  Feel free to override this method if you need dynamic validation
        // Мой комент: Тут можно использовать свой валидатор и использовать его
        // eslint-disable-next-line max-len
        const validator = this.constructor.cachedValidator || new livr2.Validator(this.constructor.validationRules).prepare()


        // eslint-disable-next-line more/no-duplicated-chains
        this.constructor.cachedValidator = validator

        return this._doValidationWithValidator(data, validator)
    }

    doValidation(data, rules) {
        // Старый комент: You can use this in overriden "validate" method
        // Мой комент:  Используется для проверки только LIVR
        const validator = new livr2.Validator(rules).prepare()

        return this._doValidationWithValidator(data, validator)
    }

    async _doValidationWithValidator(data, validator) {
        const result = validator.validate(data)

        if (!result) {
            const exception = new Exception({
                code   : 'FORMAT_ERROR',
                fields : validator.getErrors()
            })

            throw exception
        }

        return result
    }
}

export default ServiceBase
