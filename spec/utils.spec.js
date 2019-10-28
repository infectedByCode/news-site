process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const { articleData } = require('../db/data/index');
const { formatDates, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDates', () => {
  it('does not mutate the original input', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const inputCopy = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);

    expect(input).to.eql(inputCopy);
  });
  it('returns a new array of objects', () => {
    const input = articleData;
    const actualOutput = formatDates(input);

    expect(actualOutput).to.not.equal(input);
  });
  it('returns new array with SQL compatible timestamp when input an array with length 1', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actualOutput = formatDates(input);
    const expectedDateFormat = new Date(input[0].created_at);

    expect(actualOutput).to.be.an('array');
    expect(actualOutput[0]).that.has.keys(['title', 'author', 'body', 'created_at', 'votes', 'topic']);
    expect(actualOutput[0].created_at).to.eql(expectedDateFormat);
  });
  it('returns a new array of objects with the timestamp changed correctly', () => {
    const input = articleData;
    const actualOutput = formatDates(input);

    actualOutput.forEach(obj => {
      const expectedDateFormat = new Date(obj.created_at);
      expect(obj.created_at).to.eql(expectedDateFormat);
    });
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
