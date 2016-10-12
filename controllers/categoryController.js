const request = require('request');

module.exports = {
  predict: (req, res) => {
    //Offloads prediction to service and the body of the response is teh category desired
    //Send data to categorization service's /predict route
    request.post({url: 'http://localhost:5000/predict', form:{data: req.body.text} }, (err, resp, body) => {
      res.send(body);
    });
  },
  //Fits the model of the service to fit user input(This route is currently never called but should work)
  //Does not return anything except 200 status
  fit: (req, res) => {
    request.post({url: 'http://localhost:5000/fit', form:{categories:req.body.categories} }, (err, resp, body) => {
      console.log(err, resp, body);
    });

    res.sendStatus(200);
  }
};