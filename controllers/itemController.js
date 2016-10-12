const db = require('../db/model');
const ElSearch = require('../search/elasticSearch');
const coinbase = require('coinbase');
const sendEmail = require('./send-email');

const es = new ElSearch();

module.exports = {
  //Deprecated function for retrieving categories from db but is never used
  getCategories(req, res) {
    db.items.getAllCategories()
    .then(result => res.status(200).send(result));
  },
  //Get items by item id
  getItem(req, res) {
    db.items.getById(req.params.id)
      .then((result) => {
        res.json(result[0]);
      });
  },
  //Post request to buy an item
  buyItem(req, res) {
    db.items.getById(req.params.id)
    .then((product) => {
      // Product returns an array of 1 item, so need to access that item, and change the buyer of that item to be the current request maker
      db.transactions.updateTransaction(product[0].id, { buyer_id: req.user.user.id })
      .then(() => {
        db.items.sold(Number(req.params.id));
        //Creates a new client with coinbase which allows user to purchase the item from coinbase
        const client = new coinbase.Client({ accessToken: req.user.accessToken, refreshToken: req.user.refreshToken });
        const args = {
          name: `Order for ${product[0].title}`,
          amount: /* (Number(product[0].price))*/ 0.01,
          metadata: {
            customer_id: client.id,
            customer_name: 'test'
          },
          currency: 'USD',
          type: 'order',
          style: 'custom_small',
          success_url: `http://${req.headers.host}/items/${req.params.id}/confirm`,
          cancel_url: `http://${req.headers.host}/items/${req.params.id}`,
          customer_defined_amount: false,
          collect_shipping_address: false,
          description: `Purchasing: ${product[0].title} on BitBargain`
        };
        //Create a checkout button with those args, and sends it back to BB which embeds it in a button
        client.createCheckout(args, (err, checkout) => {
          console.log(err, checkout);
          if (err) {
            res.json(`Error buying ${product[0].title}`);
          }
          res.json(checkout.embed_code);
        });
      });
    });
  },
  //From the sell item form, this is where the item is created in the DB and then sent back to the user so they can see the page
  sellItem(req, res, next) {
    const newItem = req.body;
    delete newItem.categories;
    const sellerId = (req.user ? req.user.user.id : 39);

    newItem.images = JSON.stringify(newItem.images);
    console.log('Creating new item,', newItem);
    db.items.create(newItem)
    .then(product => {
      db.items.getById(product[0])
      .then((result) => {
        const id = result[0].id;
        const transaction = { item_id: id, buyer_id: null, seller_id: sellerId };
        res.json(result[0]);
        return db.transactions.create(transaction);
      })
      .catch(e => { console.log('Error getting item, ', e); next(e); });
    })
    .catch(e => { console.log('Error inserting item, ', e); next(e); });
  },
  //DEPRECATED
  shippedItem(req, res) {
    res.send('shippedItem');
  },
  updateItem(req, res) {
    res.send('updateItem');
  },
  deleteItem(req, res) {
    es.deleteItem(req.param.id).catch(e => console.error(e));
    res.send('deleteItem');
  },
  //^ DEPRECATED

  //Confirms purchase
  boughtConfirmation(req, res) {
    db.transactions.getById(req.params.id)
    .then((tx) => {
      db.users.getById(tx[0].seller_id)
      .then((seller) => {
        // The email of the seller is seller[0]['email'];
        sendEmail(seller[0].email);
      });
    });
    res.redirect('/');
  },
  //DEPRECATED function to sell item
  sell(req, res) {
    const client = new coinbase.Client({ accessToken: req.user.accessToken, refreshToken: req.user.refreshToken });
    client.getAccounts({}, (err, accounts) => {
      console.log(accounts);
    });
  },
  //DEPRECATED method that sends a random dispute back to the client
  getDisputes(req, res) {
    db.transactions.getAllDisputes()
    .then((data) => {
      const rtg = data[Math.floor(Math.random() * data.length)];
      if (rtg) {
        res.json(rtg);
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  },
  //Changes a transaction to a disputed status so it can be found by dispute service
  startDispute(req, res) {
    db.transactions.updateTransaction(req.body.id, { order_status: 'disputed' })
    .then(result => res.send(result));
  },
  //DEPRECATED function that updates a transaction with a vote on who won
  resolveDisputes(req, res) {
    req.body.polarity; // This is a boolean saying whether someone approved it or not. False means to seller, True means to buyer.
    // We should do something with it
    db.transactions.updateTransaction(req.body.id, {});
  }
};

