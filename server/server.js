const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /todos ROUTE
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    // console.log(doc);
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos ROUTE
app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    // console.log(todos);
    res.send({todos});
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

// GET /todos/:id ROUTE
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    // console.log('Id is not valid!');
    return res.status(404).send({})
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
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
app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    // console.log('Id is not valid!');
    return res.status(404).send({})
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user.id
  }).then((todo) => {
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
app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
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
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send();
  })
});


// GET /users/me ROUTE
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
});


// POST /users/login
app.post('/users/login', (req, res) => {
  var email = req.body.email;
  var password =  req.body.password;

  User.findByCredentials(email, password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/users/me/token', authenticate, (req, res ) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }), () => {
    res.status(400).send();
  };
});

//Starting express server
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports ={app};
