const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user.js');

const myUser = new User({
  firstName: 'Victor',
  email: 'aaaasdsadaasdfgsm',
  lastName: 'Rivas',
  password: 'hola'
});

myUser.create().then(() => {
  console.log('yeeje');
});

const authenticatedMongoUrl = `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`;
const initialize = async () => {
  try {
    const dbUrl = `mongodb://${authenticatedMongoUrl}${process.env.DB_SERVER}/${process.env.DB_NAME}`;

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true
    });

    console.log('Mongo Connected!');
  } catch (error) {
    throw error;
  }
};

module.exports = { initialize };
