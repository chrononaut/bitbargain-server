const assert = require('chai').assert;

const env = require('../env');
const ElSearch = require('../search/elasticSearch');

const es = new ElSearch('test');

describe('ElasticSearch', () => {
  const dummyItems = [
    {
      id: 1,
      created_at: '2016-09-21T21:05:00.000Z',
      updated_at: '2016-09-27T23:19:58.922Z',
      title: 'Kitchen aid single wall oven',
      description: '30 inch Kitchen aid',
      category: 'appliances - by owner',
      price: '$700',
      sold: false,
      location: 'hayward / castro valley',
      mages: null
    }, {
      id: 2,
      created_at: '2016-09-17T22:37:00.000Z',
      updated_at: '2016-09-27T23:19:58.922Z',
      title: 'Sewing Machine',
      description: 'Antique Westinghouse',
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
      .catch(e => done(e));
  });

  // These aren't working for some reason...

  // beforeEach('Create the testing index before each test', es.init);

  // afterEach('Delete testing index after each test', es._delete);

  // after('Close server connection upon completion', es.close);

  describe('Inserting Items', () => {
    it('Should not get an error when inserting an item', (done) => {
      es.insertItem(dummyItems[0])
        .then(() => done())
        .catch(e => done(e));
    });

    it('Should be able to find inserted item', (done) => {
      es.getItem(dummyItems[0].id)
        .then((r) => {
          assert.isTrue(r.length > 0);
          done();
        })
        .catch(e => done(e));
    });

    it('Should have equality of inserted items', (done) => {
      es.getItem(dummyItems[0].id)
        .then((r) => {
          const item = r[0]._source;
          for (let key in item) {
            assert.equal(item[key], dummyItems[0][key]);
          }
          done();
        })
        .catch(e => done(e));
    });
  });

  describe('deleting items', () => {
    it('Should not error out when deleting an item');

    it('Should be able to delete specific items');

    it('Should not delete the wrong items');
  });

  describe('searching items', () => {
    it('Should be able to search items');

    it('Should return items with a given phrase in just the title');

    it('Should return items with a given phrase in the description');
  });
});
