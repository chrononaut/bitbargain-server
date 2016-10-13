const assert = require('chai').assert;

const env = require('../env');

describe('Database', () => {
  describe('Database Unit Tests', () => {
    const db = require('../db/model');

    describe('Items', () => {
      it('Should be able get get individual items by id');

      it('Should be able to get sets of items given ids');

      it('Should be able to create items');

      it('Should be able to sell items');
    });

    describe('Users', () => {
      it('Get user information by id');

      it('Should be able to create users');

      it('Should be able to update user information');
    });

    describe('Transactions', () => {
      it('Should be able to add transaction to the database');

      it('Should be able to find transactions in the database');

      it('Should be able to cycle through the transaction stages');

      it('Should be able to lookup disputed items');

      it('Should be able to update disputed items statuses');
    });
  });

  describe('Database Integration Tests', () => {
    describe('Posting New Items', () => {
      it('Posting new items should create items in the database');
    });

    describe('Getting Specific Products', () => {
      it('Getting a product by id should return specific products from the database');
    });

    describe('Removing Specific Products', () => {
      it('Buying an item should update it\'s status in the database');
    });
  });
});
