const assert = require('assert');

const env = require('../env');
const ElSearch = require('../search/elasticSearch');

const es = new ElSearch('test');

describe('ElasticSearch', () => {
  describe('Hooks', () => {
    // Create test index after each index.
    beforeEach(es._init);

    // Delete test index after each test.
    afterEach(es._delete);

    // Close the connection to elastic search when completed.
    after(es.close);
  });

  describe('Ping', () => {
    it('Should be able to connect to the server', (done) => {
      es.ping().then((r) => {
        if (r === true) {
          done();
        } else {
          throw new Error('Could not connect to elastic search');
        }
      });
    });
  });

});
