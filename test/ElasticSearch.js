const assert = require('assert');

const env = require('../env');
const ElSearch = require('../search/elasticSearch');

const es = new ElSearch('test');

describe('ElasticSearch', () => {

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
