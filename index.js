const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const uuid = require('uuid');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const {
  check,
  validationResult
} = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// mongoose.connect('mongodb://localhost:27017/myFlixDB'); //, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI);


let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);
app.use(morgan('common'));
app.use(express.static('public'));

app.use(methodOverride());

// testing WELCOME code 
app.get("/", (req, res) => {
  res.send("Welcome to My Movies!");
});

// CREATE - add a user
app.post('/users', [
  check('Username', 'Username is required').isLength({
    min: 5
  }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({
      Username: req.body.Username
    })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error:' + error);
    });
});

// READ - Get User by Username 
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({
      Username: req.params.Username
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Get a list of all Movies
app.get('/movies', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + err);
    });
});


// READ - Get movie by Title
app.get('/movies/:Title', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  Movies.findOne({
      Title: req.params.Title
    })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Get Data about a Genre 
app.get('/movies/genres/:genreName', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  await Movies.find({
      'Genre.Name': req.params.genreName
    })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Get data about a Director 
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  await Movies.find({
      'Director.Name': req.params.directorName
    })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// UPDATE  - updating user info
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({
    min: 5
  }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }

  await Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, {
      new: true
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Add a Movie to User's List of Favorites
app.post('/users/:Username/movies/:ObjectId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $push: {
        favorite_Movies: req.params.ObjectId
      }
    }, {
      new: true
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// REMOVE A movie from list of Favorites
app.delete('/users/:Username/movies/:ObjectId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $pull: {
        favorite_Movies: req.params.ObjectId
      }
    }, {
      new: true
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});


// DELETE a user by Username 
app.delete('/users/:Username', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  await Users.findOneAndDelete({
      Username: req.params.Username
    })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
// server 
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port' + port);
});