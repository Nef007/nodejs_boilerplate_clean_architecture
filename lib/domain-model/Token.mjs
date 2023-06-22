import { DataTypes as DT } from '../../packages.mjs'

import Base                from './Base.mjs'
import User                from './User.mjs'


class Token extends Base {
    static schema = {
        id           : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        refreshToken : { type: DT.STRING, allowNull: false },
        userId       : {
            type       : DT.UUID,
            references : { model: 'Users', key: 'id' },
            onUpdate   : 'CASCADE',
            onDelete   : 'CASCADE',
            allowNull  : false
        }

    }

    static initRelations() {
        this.belongsTo(User, {
            as         : 'user',
            foreignKey : 'userId'

        })
    }


    static async saveToken(userId,  refreshToken) {
        const tokenData = await this.findOne({ where : {
            userId
        } })

        if (tokenData) {
            tokenData.refreshToken = refreshToken

            return  tokenData.save()
        }

        await this.create({ refreshToken, userId })
    }
}

export default Token
