const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const db = require('./db');

db.initialize();
const router = require('./routes/');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(router);

module.exports = app;
