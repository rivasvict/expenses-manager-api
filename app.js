const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const authenticatedMongoUrl = process.env.NODE_ENV === 'development' ? '' : `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`;
const connectToMongo = async () => {
  try {
    const dbUrl = `mongodb://${authenticatedMongoUrl}${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    await mongoose.connect(dbUrl, {
      userCreateIndex: true,
      useNewUrlParser: true
    });

    console.log('Mongo Connected!');
  } catch (error) {
    throw error;
  }
};

connectToMongo();

const routes = require('./routes/index');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(routes);

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(new Error(err.message || 'Internal server error').stack);
});

module.exports = app;
