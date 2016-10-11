const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const clientRouter = require('./router/clientRouter');
const authRouter = require('./router/authRouter');
const userTracker = require('./tracker/trackUser');

const port = process.env.PORT || 9009;
const app = express();


app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(morgan('dev'));
app.use('/', authRouter);
app.use('/api/track/:id$', userTracker);
app.use('/api', clientRouter);

app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});

