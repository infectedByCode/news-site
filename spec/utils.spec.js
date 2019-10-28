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

describe('makeRefObj', () => {
  it('does not mutate the input array', () => {
    const input = [
      {
        id: 1,
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
        id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];

    makeRefObj(input);

    expect(input).to.eql(inputCopy);
  });
  it('returns an empty object when passed an empty array', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('returns a key value pair inside an object when the array length is 1', () => {
    const input = [
      {
        id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expectedOutput = {
      'Living in the shadow of a great man': 1
    };

    expect(makeRefObj(input)).to.eql(expectedOutput);
  });
  it('returns an array of objects with key value pairs of title: id of the article', () => {
    const input = [
      {
        id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        id: 2,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      },
      {
        id: 3,
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171
      }
    ];
    const expectedOutput = {
      'Living in the shadow of a great man': 1,
      'Eight pug gifs that remind me of mitch': 2,
      'Student SUES Mitch!': 3
    };
    expect(makeRefObj(input)).to.eql(expectedOutput);
  });
});

describe('formatComments', () => {
  it('does not mutate the data given', () => {
    const input = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const inputCopy = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const objRef = { "They're not exactly dogs, are they?": 1 };
    formatComments(input, objRef);
    expect(input).to.eql(inputCopy);
  });
  it('returns an empty array when passed one', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('returns an array with one object with data formatted correctly when passed an array with lenght 1', () => {
    const input = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const objRef = { "They're not exactly dogs, are they?": 1 };
    const timestamp = new Date(input[0].created_at);
    const actualOutput = formatComments(input, objRef);
    const expectedOutput = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: 'butter_bridge',
        votes: 16,
        created_at: timestamp
      }
    ];
    expect(actualOutput).to.eql(expectedOutput);
  });
  it('returns a reformatted array of objects when passed an array of comments with length greater than 1', () => {
    const input = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: 1416746163389
      },
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'icellusedkars',
        votes: 16,
        created_at: 1101386163389
      }
    ];
    const objRef = {
      'Living in the shadow of a great man': 1,
      "They're not exactly dogs, are they?": 2,
      'UNCOVERED: catspiracy to bring down democracy': 3
    };
    const actualOutput = formatComments(input, objRef);
    const expectedOutput = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        article_id: 1,
        author: 'icellusedkars',
        votes: -100,
        created_at: new Date(1416746163389)
      },
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 2,
        author: 'butter_bridge',
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
        article_id: 3,
        author: 'icellusedkars',
        votes: 16,
        created_at: new Date(1101386163389)
      }
    ];
    expect(actualOutput).to.eql(expectedOutput);
  });
});
