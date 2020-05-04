//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// define the Express app
const app = express();

// enhance your app security with helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// use bodyParser to parse app/json content-type
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

// other require statements
const routes = require('./routes');

// express app definition and middleware config
app.use('/micro-posts', routes);

module.exports = app;
