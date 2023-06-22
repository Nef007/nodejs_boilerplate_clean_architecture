import crypto              from 'crypto'
import { DataTypes as DT } from '../../packages.mjs'

import Base                from './Base.mjs'
import { InactiveObject }  from './X.mjs'

import Token from './Token.mjs'


const SALT_LENGTH = 16
const KEY_LENGTH  = 64


class User extends Base {
    static schema = {
        id           : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        email        : { type: DT.STRING, allowNull: false, unique: true },
        status       : { type: DT.ENUM('ACTIVE', 'BLOCKED', 'PENDING'), defaultValue: 'PENDING' },
        firstName    : { type: DT.STRING, defaultValue: '' },
        secondName   : { type: DT.STRING, defaultValue: '' },
        patronymic   : { type: DT.STRING, defaultValue: '' },
        // avatar         : { type: DT.STRING, defaultValue: '' },
        // lang           : { type: DT.STRING(STRING_LENGTH), defaultValue: config.defaultLang },
        // agreeWithTerms : { type: DT.BOOLEAN, allowNull: false },
        passwordHash : { type: DT.STRING },
        salt         : { type: DT.STRING },
        password     : { type : DT.VIRTUAL,
            set(password) {
                const salt = this._generateSalt()

                this.setDataValue('salt', salt)
                this.setDataValue('passwordHash', this._hashPassword(password, salt))
            } }
    }

    static initRelations() {
        User.hasOne(Token, {
            as         : 'refreshToken',
            foreignKey : 'userId'

        })
    }


    // static async find(dbRequest) {
    //     return   this.findAll({
    //         ...dbRequest
    //     })
    // }


    /**
     * Реализация метода findById с дополнительной проверкой "статуса"
     * @param {String} id  id User которого нужно найти
     * @param {Object} options - набор фильтров:
     * {
     * allowBlocked: false,
     * allowPending: false
     * }
     * @returns {Promise<Object>} - User
     */
    static async findById(id, options = {}) {
        const entity = await super.findById(id)


        if (entity.status === 'BLOCKED' && !options.allowBlocked) {
            throw new InactiveObject({
                message : `User with id = "${id}" has status = "BLOCKED"`,
                field   : 'id'
            })
        }

        if (entity.status === 'PENDING' && !options.allowPending) {
            throw new InactiveObject({
                message : `User with id = "${id}" has status = "PENDING"`,
                field   : 'id'
            })
        }

        return entity
    }

    checkPassword(plain) {
        const hash = this._hashPassword(plain, this.salt)

        return hash === this.passwordHash
    }

    _generateSalt() {
        const salt = crypto.randomBytes(SALT_LENGTH)

        return salt.toString('hex')
    }

    _hashPassword(password, salt) {
        const hash = crypto.scryptSync(password, salt, KEY_LENGTH) // eslint-disable-line no-sync

        return hash.toString('hex')
    }

    // Actions
    activate() {
        return this.update({ status: 'ACTIVE' })
    }

    async resetPassword({ password }) {
        await this.activate()

        return this.update({ password })
    }
}

export default User
