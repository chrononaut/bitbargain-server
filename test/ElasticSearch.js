const assert = require('assert');

const env = require('../env');
const ElSearch = require('../search/elasticSearch');

const es = new ElSearch('test');

describe('ElasticSearch', () => {
  var dummyItems = [
    { id: 1,
       created_at: '2016-09-21T21:05:00.000Z',
       updated_at: '2016-09-27T23:19:58.922Z',
       title: 'Kitchen aid single wall oven',
       description: '30 inch Kitchen aid single wall oven .(convection oven )  Never been used . Displayed in our model home . ',
       category: 'appliances - by owner',
       price: '$700',
       sold: false,
       location: 'hayward / castro valley',
      images: null
    }, {
      id: 2,
      created_at: '2016-09-17T22:37:00.000Z',
      updated_at: '2016-09-27T23:19:58.922Z',
      title: 'Sewing Machine',
      description: 'Antique Westinghouse Wheeler Rotary in cabinet. Needs tuning up but it works. It has a knee pedal.    ',
      category: 'antiques - by owner',
      price: '$40',
      sold: false,
      location: 'hayward / castro valley',
      images: null
    }
  ];

  before('Should be able to ping server before tests start', (done) => {
    es.ping()
      .then((r) => {
        if (r === true) {
          done();
        } else {
          throw new Error('Could not ping server');
        }
      })
      .catch(e => throw new Error(`There was an error ${e}`));
  });

  beforeEach('Create the testing index before each test', () => {
    es._init();
  });

  afterEach('Delete testing index after each test', es._delete);

  after('Close server connection upon completion', es.close);

  describe('Should insert items into index', (done) => {
    es.insert
  });
});
