const db = require('../db/model');
const bitcoin = require('../bitcoin/config');

//Used to determine whether the current user purchased the viewed item,

module.exports = {
  createAccount(req, res) {
    // create new account with identifier
    // returns a promise that resolves with a new address for the account
    bitcoin.getAccountAddress(req.body.email)
    .then(address => res.json({ address }))
    .catch(err => console.error('Error creating new account', err));
  },
  findUserRole(req, res) {
    if (req.isAuthenticated()) {
      db.transactions.getByItemId(req.params.id)
      .then((result) => {
        if (result.length) {
          if (result[0].user_id === req.user.user.id) {
            res.json({ role: 'user' });
          }
          if (result[0].seller_id === req.user.user.id) {
            res.json({ role: 'seller' });
          }
        } else {
          res.json({ role: 'guest' });
        }
      });
    } else {
      res.json({ role: 'guest'});
    }
  },
  getAccountBalance(req, res) {
    bitcoin.getBalance(req.body.email)
    .then(result => {
      console.log(result);
      res.json({result});
    })
    .catch(err => console.error('Error getting balance'))
  },
  sendPayment(req, res, next) {
    const amount = Number(req.body.price);
    const fee = amount * 0.01, remainder = amount - fee;
    let buyer = '', seller = '';
    db.transactions.getByItemId(req.body.id)
    .then(item => Promise.all([db.users.getById(item[0]['seller_id']), db.users.getById(req.user.user.id)]))
    .then(users => {
      buyer = users[0].email;
      seller = users[1].email;
    })
    .then(() => bitcoin.move(buyer, seller, remainder))
    .then(result => bitcoin.move(buyer, fees, fee))
    .then(result => res.send('Payment sent'))
    .catch(err => next(err));
  }
};
