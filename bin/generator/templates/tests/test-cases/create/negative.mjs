import generateDataFixtures   from '../../../../utils/generateDataFixtures.mjs'


export default {
    '01-not-unique-field' : (schema, data) => {
        let uniqueFieldKey = ''

        for (const [ key, field ] of Object.entries(schema)) {
            if (field.unique === true) {
                uniqueFieldKey = key
                break
            }
        }

        if (!uniqueFieldKey) return {}

        const object = {
            ...generateDataFixtures(schema, 1)[0],
            [uniqueFieldKey] : data[0][uniqueFieldKey]
        }

        return {
            input : {
                ...object
            },
            exception : {
                'code'   : 'NOT_UNIQUE',
                'fields' : {
                    [uniqueFieldKey] : 'NOT_UNIQUE'
                }
            }

        }
    }
}
