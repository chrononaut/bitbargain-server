const request = require('request');


module.exports = {
  predict: (req, res) => {
    //Send data to categorization service's /predict route
    request.post({url: 'http://localhost:5000/predict', form:{data: req.body.text} }, (err, resp, body) => {
      res.send(body);
    });
  },
  fit: (req, res) => {
    request.post({url: 'http://localhost:5000/fit', form:{categories:req.body.categories} }, (err, resp, body) => {
      console.log(err, resp, body);
    });

    res.sendStatus(200);
  }
};