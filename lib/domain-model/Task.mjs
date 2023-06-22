import { DataTypes as DT } from '../../packages.mjs'
import User from './User.mjs'
import Base                from './Base.mjs'


class Task extends Base {
    static schema = {
        id          : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        shortName   : { type: DT.STRING, allowNull: false, unique: true },
        description : { type: DT.STRING },
        status      : { type: DT.ENUM('ACTIVE', 'ARCHIVE', 'PENDING'), defaultValue: 'PENDING', allowNull: false },
        userId      : {
            type       : DT.UUID,
            references : { model: 'Users', key: 'id' },
            onUpdate   : 'RESTRICT',
            onDelete   : 'RESTRICT',
            allowNull  : false
        }

    }


    static initRelations() {
        this.belongsTo(User, {
            as         : 'user',
            foreignKey : 'userId'
        })
    }
}

export default Task
