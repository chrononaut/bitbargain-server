const router = require('express').Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const configPassport = require('../controllers/strategies');
const exSess = require('express-session');
const db = require('../db/model.js');

//Configure passport to use the strategies we have provided it with(Local/Coinbase)
configPassport(passport);

//Serialize User: Aka make every user look same regardless of strategy
passport.serializeUser((user, done) => {
  //If we are using coinbase
  if (user.profile && user.profile.provider === 'coinbase') {
    //We are going to store the email of the user, accessToken, and refreshToken on the client so we can later have access to those
    done(null, { email: user.profile.emails[0].value, accessToken: user.accessToken, refreshToken: user.refreshToken });
  } else {
    //Otherwise we only have a username and we have to store access token as null
    done(null, { email: user, accessToken: null, refreshToken: null });
  }
});

//Whenever we get a request from the client and we need to get more data on the user, we query the database,
//And remove password from what is being stored
passport.deserializeUser((obj, done) => {
  db.users.getByEmail(obj.value || obj.email)
  .then((user) => {
    delete user[0].password;
    done(null, { user: user[0], accessToken: obj.accessToken, refreshToken: obj.refreshToken });
  });
});


//Express session and passport session allow user to return to page without having to login again
//passport initialize calls serialize and deserialize user
router
  .use(exSess({ secret: 'keyboard cat', name: 'bit.sid', resave: true, saveUninitialized: true }))
  .use(passport.initialize())
  .use(passport.session())
  .get('/auth/persist', authController.persist)
  .get('/auth/test', (req, res) => { console.log(req.user); res.send(JSON.stringify(req.user)); })
  .get('/auth/failedLogin', authController.fail)
  .post('/auth/login/local', authController.local.login, passport.authenticate('local'), authController.success)
  .post('/auth/signup/local', authController.local.signup, passport.authenticate('local'), authController.success)
  .get('/auth/login/coinbase', passport.authenticate('coinbase'))
  .get('/auth/login/coinbase/callback', passport.authenticate('coinbase', { failureRedirect: '/login' }), authController.coinbase.login)
  .get('/auth/login/square', passport.authenticate('square'))
  .get('/auth/login/coinbase/callback', passport.authenticate('square', { failureRedirect: '/login' }), authController.square.login)
  .get('/auth/logout', authController.logout);


module.exports = router;
