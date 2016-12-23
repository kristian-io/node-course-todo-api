const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '585d7a8171a2f236c4d2763311';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });


// Todo.findById(id)
//   .then((todo) => {
//     if (!todo) {
//       return console.log('ID not found');
//     }
//     console.log('Todo By Id', todo);
//   }).catch((e) => console.log(e));

var id = '585c37d4e56ada1a7801b8c3';

User.findById(id)
  .then((user) => {
    if (!user) {
      return console.log("User ID not found");
    }
    console.log('User by ID', user);
  }, (e) => {
    console.log(e);
  });
