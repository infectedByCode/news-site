const ENV = process.env.NODE_ENV || 'development';

const data = {
  development: require('../data/development-data'),
  test: require('../data/test-data'),
  production: require('../data/development-data')
};

module.exports = data[ENV];
