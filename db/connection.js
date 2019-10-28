const knex = require('knex');
const dbConfig = require('../db/data');

const connection = knex(dbConfig);

module.exports = connection;
