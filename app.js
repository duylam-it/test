const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
const log = require('morgan');
app.use(log('dev'));

// Setup Cookie Parser
app.use(cookieParser());

// Setup Cross Origin
app.use(cors());

// Bring in the models
require('./models/User');
require('./models/Otp')
require('./models/Room')
require('./models/Message')

// Bring in the routes
const routes = require('./routes');
routes(app);

// DB Connect
const db = require('./config/db');
db.connect();

module.exports = app;
