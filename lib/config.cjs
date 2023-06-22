/* eslint-disable import/no-commonjs */

// is needed for sequelize-cli migrations/seeds

const confme = require('confme');

// Проверяет все ли переменные заданы в .evn.defaults по схеме configs/config.json`
const config = confme(`${__dirname}/../configs/config.json`);

module.exports = config;
