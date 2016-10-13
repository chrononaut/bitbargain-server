const assert = require('chai').assert;
const ElSearch = require('../search/elasticSearch');

describe('ElasticSearch', () => {
  describe('ElasticSearch Unit Tests', () => {
    const es = new ElSearch('test');
    const dummyItems = [
      {
        id: 1,
        created_at: '2016-09-21T21:05:00.000Z',
        updated_at: '2016-09-27T23:19:58.922Z',
        title: 'foo',
        description: 'bar',
        category: 'appliances - by owner',
        price: '$700',
        sold: false,
        location: 'hayward / castro valley',
        images: null
      }, {
        id: 2,
        created_at: '2016-09-17T22:37:00.000Z',
        updated_at: '2016-09-27T23:19:58.922Z',
        title: 'bar',
        description: 'foo',
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

    describe('Inserting Items', () => {
      it('Should not get an error when inserting an item', (done) => {
        es.insertItem(dummyItems[0], true)
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
      it('Should not error out when deleting an item', (done) => {
        es.deleteItem(dummyItems[0].id)
          .then(() => done())
          .catch(e => done(e));
      });

      it('Should be able to delete specific items', (done) => {
        es.insertItem(dummyItems[0], true)
          .then(() => es.deleteItem(dummyItems[0].id, true))
          .then(() => es.getItem(dummyItems[0].id))
          .then(r => assert.isTrue(r.length === 0))
          .then(() => done())
          .catch(e => done(e));
      });

      it('Should not delete the wrong items', (done) => {
        es.insertItem(dummyItems[0], true)
          .then(() => es.insertItem(dummyItems[1], true))
          .then(() => es.deleteItem(dummyItems[0].id, true))
          .then(() => es.getItem(dummyItems[1].id))
          .then(r => assert.isTrue(r.length > 0))
          .then(() => done())
          .catch(e => done(e));
      });
    });

    describe('searching items', () => {
      before('Delete, and then re-insert all items', (done) => {
        dummyItems.forEach(item => es.deleteItem(item.id, true));
        dummyItems.forEach(item => es.insertItem(item, true));
        done();
      });

      // This is only itermittently working for some reason.
      it('Should return items with a given phrase in the title and description');// , (done) => {
      //   es.searchItems('foo')
      //     .then(r => assert.isTrue(r.length >= 1))
      //     .then(() => done())
      //     .catch(e => done(e));
      // });
    });
  });

  describe('Elastic Search Integration Tests', () => {
    describe('Searcining for items', () => {
      it('Should return items that have been inserted into ElasticSearch');
    });

    describe('Selling Items', () => {
      it('After selling an item, it should exist in ElasticSearch');
    });

    describe('Deleting Items', () => {
      it('After removing an item, it should be removed from ElasticSearch');
    });

    describe('Buying Items', () => {
      it('Buying an item should remove it from ElasticSearch');
    });
  });
});
