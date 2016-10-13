const nodemailer = require('nodemailer');
const secrets = require('../config/secrets');

//A mailing service for when someone buys a product
var poolConfig = 'smtps://user%40gmail.com:pass@smtp.gmail.com/?pool=true';

//Gmail account info
var poolConfig = {
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'codebay.sales@gmail.com',
    pass: secrets.emailPass
  }
};
//Creates a mailer
const transporter = nodemailer.createTransport(poolConfig);

//Exports a function which takes an email, and an item, and emails someone that their item has been sold on BB

const mailSingle = (email, item) => {
  const mailOptions = {
    from: '<codebay.sales@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Thank you 💕', // Subject line
    html: `Your item has been purchased on BitBargain/codebay!<br/> Please check your profile to confirm transfer of ${item || 'the item'}. ✓<br/><a class="btn" href="http://bitbargains.online/">Go to BitBargain</a>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(`Message sent: ${info.response}`);
  });
};

const mailDouble = (seller, buyer, item) => {
  const mailBuyer = {
    from: '<codebay.sales@gmail.com>', // sender address
    to: buyer, // list of receivers
    subject: 'Thank you 💕', // Subject line
    html: `You purchased ${seller}'s ${item || 'item'} on BitBargain.online! Please contact the seller at ${seller} in order to receive your product`
  };
  const mailSeller = {
    from: '<codebay.sales@gmail.com>', // sender address
    to: seller, // list of receivers
    subject: 'Thank you 💕', // Subject line
    html: `${buyer} has purchased your ${item || 'item'} on BitBargain.online! Please contact them in order to confirm shipment of product`
  };
  transporter.sendMail(mailBuyer, (error, info) => {
    if (error) {
      return console.log(error);
    }
    // console.log(`Message sent: ${info.response}`);
  });
  transporter.sendMail(mailSeller, (error, info) => {
    if(error) {
      return console.log(error);
    }
  });
}
module.exports = {
  mailSingle,
  mailDouble
};
