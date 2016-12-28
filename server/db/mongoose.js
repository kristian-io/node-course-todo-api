var mongoose = require('mongoose');

var dblogin = require('./../../private/dblogin.js');

// console.log(dblogin.user, dblogin.password);

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dblogin.user}:${dblogin.password}@ds141328.mlab.com:41328/data`);
// mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}
