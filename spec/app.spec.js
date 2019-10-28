process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai.expect;
const request = require('supertest');

const app = require('../app');

describe('app.js', () => {
  // Setup for tests
  beforeEach(() => {
    return connection.seed.run();
  });
  afterEach(() => {
    connection.destroy();
  });
  // Testing for endpoints
});
