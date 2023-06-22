// eslint-disable-next-line import/no-commonjs
module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tasks', {
            id          : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            shortName   : { type: Sequelize.STRING, allowNull: false, unique: true },
            description : { type: Sequelize.STRING },
            status      : { type: Sequelize.ENUM('ACTIVE', 'ARCHIVE', 'PENDING'), defaultValue: 'PENDING', allowNull: false },
            userId      : { type: Sequelize.UUID, references: { 'model': 'Users', 'key': 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE', allowNull: false },
            createdAt   : { type: Sequelize.DATE, allowNull: false },
            updatedAt   : { type: Sequelize.DATE, allowNull: false }
        })
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Tasks')
    }
}
