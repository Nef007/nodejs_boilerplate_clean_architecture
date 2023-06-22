import jsonPointer from 'json-pointer'
import renameKeys from 'rename-keys'


class Exception extends Error {
    constructor(data) {
        super()
        if (!data.fields) throw new Error('FIELDS_REQUIRED')
        if (!data.code) throw new Error('MESSAGE_REQUIRED')


        const fields = jsonPointer.dict(data.fields)

        this.fields = renameKeys(fields, str => str.substring(1))

        this.code = data.code
        this.message = data.message
    }


    /**
     * @typedef Exception
     * @property {integer} code.required
     * @property {object} fields.required
     */
    toHash() {
        return {
            code   : this.code,
            fields : this.fields

        }
    }
}
export default  Exception
