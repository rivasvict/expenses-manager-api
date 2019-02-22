const User = require('../models/user.js');

const signUp = async (userToCreate) => {
  try {
    const user = new User(userToCreate);
    return await user.create();
  } catch (error) {
    throw error;
  }
};

/* signUp({
  firstName: 'Victor',
  email: 'ooooooollaaaa',
  lastName: 'Rivas',
  password: 'hola'
}).then(() => console.log('Brutal brutal')).catch(error => console.log(error));*/

module.exports = { signUp };
