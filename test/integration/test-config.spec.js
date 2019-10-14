const mongoose = require('mongoose');

const db = mongoose.connection;

after('Close db connection', async function () {
  await db.close();
});
