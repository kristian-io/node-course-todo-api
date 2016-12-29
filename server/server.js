const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

// DELETE /todos:id ROUTE
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    // console.log('Id is not valid!');
    return res.status(404).send({})
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (todo) {
      res.send({todo});
    } else {
      res.status(404).send({})
    }
  }).catch((e) => {
    res.status(400).send();
  });
});

// PATCH /todos:id ROUTE
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed'])
  if (!ObjectID.isValid(id)) {
    // console.log('Id is not valid!');
    return res.status(404).send({})
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
})

// POST /users ROUTE
app.post('/users', (req, res) => {
  var user = new User (_.pick(req.body, ['email', 'password']))
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//Starting express server
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports ={app};
