const ENV = process.env.NODE_ENV || 'development';
const development = require('../data/development-data');
const test = require('../data/test-data');

const data = {
  development,
  test,
  production: development
};

module.exports = data[ENV];
