const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();


const users = [{
  _id: userOneId,
  email: 'olo@example.com',
  password: 'pwd123',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'oli@example.com',
  password: 'pwd456'
}]

const todos = [{
  _id: new ObjectID(),
  text: "hahaha"
  }, {
  _id: new ObjectID(),
  text: "hehehe"
  }];


const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
}
