
// eslint-disable-next-line import/no-commonjs,import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid')


// eslint-disable-next-line import/no-commonjs
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', [
            {
                'id'           : uuidv4(),
                'email'        : 'vkaidalov2@ya.ru',
                // 'status'   : 'КРАСНОГОСКИЙ УВД',
                'firstName'    : 'Влад',
                'secondName'   : 'Кайдалов',
                'patronymic'   : 'Эдуардович',
                'passwordHash' : 'a7bc4a693515b5a825b6b5990ea1cb245e02db13b25e51770123403774e9bd88fa7def07167b7c4301da36c0b4efb55dfd7c52d5dfabbad7724496f8eb6e36eb',
                'salt'         : 'fbef4d803e73d127acdd1f7e31d33f12',
                'updatedAt'    : new Date(),
                'createdAt'    : new Date()
            }, {
                'id'           : uuidv4(),
                'email'        : 'vkaidalov3@ya.ru',
                // 'status'   : 'КРАСНОГОСКИЙ УВД',
                'firstName'    : 'Влад',
                'secondName'   : 'Кайдалов',
                'patronymic'   : 'Эдуардович',
                'passwordHash' : 'a7bc4a693515b5a825b6b5990ea1cb245e02db13b25e51770123403774e9bd88fa7def07167b7c4301da36c0b4efb55dfd7c52d5dfabbad7724496f8eb6e36eb',
                'salt'         : 'fbef4d803e73d127acdd1f7e31d33f12',
                'updatedAt'    : new Date(),
                'createdAt'    : new Date()
            }
        ], {})
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {})
    }
}
