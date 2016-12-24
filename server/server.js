const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

// POST /todos ROUTE
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    // console.log(doc);
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos ROUTE
app.get('/todos', (req, res) => {
  Todo.find({}).then((todos) => {
    // console.log(todos);
    res.send({todos});
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

// GET /todos/:id ROUTE
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    // console.log('Id is not valid!');
    return res.status(404).send({})
  }
  Todo.findById(id).then((todo) => {
    if (todo) {
      res.send({todo})
    } else {
      res.status(404).send({})
    }
  }, (e) => {
    res.status(400).send({})
  });
  // res.send(req.params);
});


//Starting express server
app.listen(3000, () => {
  console.log('Started on port 3000');
});


module.exports ={app};
