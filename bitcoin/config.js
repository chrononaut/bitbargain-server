const bitcoin = require('bitcoin-promise');
const client = new bitcoin.Client({
  host: process.env.BTC_HOST,
  port: 18332,
  user: process.env.BTC_USER,
  pass: process.env.BTC_PASS,
  timeout: 30000
});

client.getInfo()
.then(res => console.log('Connected to Bitcoin server', res))
.catch(err => console.error(err));

module.exports = client;
