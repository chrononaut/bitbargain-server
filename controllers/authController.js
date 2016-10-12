// const passport = require('passport');
// const jwt = require('jwt-simple');
const db = require('../db/model');
const bcrypt = require('bcrypt');
const request = require('request');

const strategies = {};
//Local functions for logging in and signing up
strategies.local = {
  login: (req, res, next) => {
    //Finds user with given email
    db.users.getByEmail(req.body.email)
    .then((data) => {
      //Compares the input password with the password in the database, and if correct, continues to next step
      bcrypt.compare(req.body.password, data[0].password, (err, same) => {
        if (same) {
          next();
        } else {
          res.send(JSON.stringify('Incorrect Username or password'));
        }
      });
    })
    .catch((error) => {
      res.send(JSON.stringify(error.code));
    });
  },
  signup: (req, res, next) => {
    //Hashes password and stores new user in database with hashed password and email
    bcrypt.hash(req.body.password, 7, (err, hash) => {
      db.users.create({ email: req.body.email, password: hash })
      .then((data) => {
        // request({'URL FOR ELECTRUM', form:req.body.email})
        next();
      })
      .catch((error) => {
        res.send(JSON.stringify(error.code));
      });
    });
  }
};

//Functions uses when authenticating through coinbase
strategies.coinbase = {
  login: (req, res) => {
    db.users.getByEmail(req.user.profile.emails[0].value)
    .then((data) => {
      //if a user exists in the database with that email
      if (data[0]) {
        //Updates the user profile with the coinbase id so we can use that later to find the user
        db.users.updateUser(req.user.profile.emails[0].value, { coinbase_id: req.user.profile.id })
        .then((result) => {
          //Redirects them back to the homepage after we have updated the user
          res.redirect('/');
        })
        .catch((err) => {
          res.redirect('/');
        });
      } else {
        //if no user exists, we're going to create a user with the displayname and email from coinbase for later reference
        db.users.create({ username: req.user.profile.displayName, email: req.user.profile.emails[0], coinbase_id: req.user.profile.id })
        .then((result) => {
          //Redirect to home page after user has been successfully(or not) created
          res.redirect('/');
        })
        .catch((err) => {
          res.redirect('/');
        });
      }
    });
  }
  // Only has login because we assume they can't sign up through coinbase on our site
};

//Future strategy for square but was never implemented because of laws regarding dollar escrowing.
strategies.square = {
  login: (req, res) => {
    db.users.getByEmail(req.user.profile.emails[0].value)
    .then((data) => {
      if (data[0]) {
        db.users.updateUser(req.user.profile.emails[0].value, { square_id: req.user.profile.id })
        .then((result) => {
          console.log(result);
          res.redirect('/');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/');
        });
      } else {
        db.users.create({ username: req.user.profile.displayName, email: req.user.profile.emails[0], square_id: req.user.profile.id })
        .then((result) => {
          console.log(result);
          console.log('User created successfully');
          res.redirect('/');
        })
        .catch((err) => {
          res.redirect('/');
        });
      }
    });
  }
};

//Failed login for oauth, only called whenever it can't properly authenticate
strategies.fail = (req, res) => {
  res.sendStatus(401);
};

//Used upon successful oauth
strategies.success = (req, res) => {
  res.json(true);
};

//Persistent sessions, called whenever user switches tab or refreshes the page so they don't have to sign in every time
strategies.persist = (req, res) => {
  if (req.user) {
    res.json(req.user.user.email);
  } else {
    res.send('');
  }
};

//When the user wants to logout, redirect them to home page afterwards.
strategies.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};


module.exports = strategies;
