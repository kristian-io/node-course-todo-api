var mongoose = require('mongoose');

let user="user";
let password='*mlab123456';


mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dblogin.user}:${dblogin.password}@ds141328.mlab.com:41328/data`);
// mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}
