var mongoose = require('mongoose');

let user="user";
let password='T_u!6phEcraY';


mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${user}:${password}@ds141358.mlab.com:41358/data`);
// mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}
