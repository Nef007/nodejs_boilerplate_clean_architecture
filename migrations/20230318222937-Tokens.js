// eslint-disable-next-line import/no-commonjs
module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tokens', {
            id           : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            refreshToken : { type: Sequelize.STRING, allowNull: false },
            userId       : { type: Sequelize.UUID, references: { 'model': 'Users', 'key': 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE', allowNull: false },
            createdAt    : { type: Sequelize.DATE, allowNull: false },
            updatedAt    : { type: Sequelize.DATE, allowNull: false }
        })
    },


    down : (queryInterface) => {
        return queryInterface.dropTable('Tokens')
    }
}
