const express = require('express');
const  morgan = require('morgan');
const bodyParser = require('body-parser');
const  methodOverride = require('method-override');
const uuid = require('uuid');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB'); //, { useNewUrlParser: true, useUnifiedTopology: true });

let myLogger = (req,res,next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);
app.use(morgan('common'));
app.use(express.static('public'));

app.use(methodOverride());

// CREATE in Mongoose - add a user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
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

// READ - Get User by Username with Mongoose
  app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// READ - Get a list of all Movies
  app.get('/movies', async (req, res) => {
    Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// READ - Get a list of all Users (personal use)
  app.get('/users', async (req, res) => {
    Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
  });

// READ - Get movie by Title
  app.get('/movies/:Title', async (req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// READ - Get Data about a Genre 
  app.get('/movies/genres/:genreName', async (req, res) => {
    await Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// READ - Get data about a Director 
  app.get('/movies/directors/:directorName', async (req, res) => {
    await Movies.find({ 'Director.Name': req.params.directorName })
    .then((movies) => {
      res.json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// UPDATE in mongoose - updating user info
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate ({ Username: req.params.Username }, {
    $set: 
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday 
    }
  },
  { new: true})
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

// Add a Movie to User's List with Mongoose 
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID },
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// REMOVE A movie from list with Mongoose 
app.post("/users/:Username/:movieTitle", async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.movieTitle },
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// DELETE a user by Username with Mongoose 
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
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


// // Get list of all movies 
// app.get('/movies', (req,res) => {
//   res.json(movies);
// })

// // getting a movie by title 
// app.get('/movies/:title', (req, res) => {
//   const { title } = req.params;
//   const movie = movies.find(movie => movie.title === title );
  
//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//     res.status(404).send('No movies found.');
//   }
// });

// getting movie by  genre
// app.get('/movies/genre/:genreName', (req, res) => {
//   const { genreName } = req.params;
//   const genre = movies.find(movie => movie.genre.name === genreName);
  
//   if (genre) {
//     res.status(200).json(genre);
//   } else {
//     res.status(404).send('No movies found for this genre.');
//   }
// });

// // getting data about a director by name 
// app.get('/movies/directors/:directorName', (req, res) => {
//   const { directorName } = req.params;
//   const director = movies.find(movie => movie.director.name === directorName);
  
//   if (director) {
//     res.status(200).json(director);
//   } else {
//     res.status(400).send('Director not found');
//   }
// });

 // registration for users 
// app.post('/users', (req, res) => {
//   const newUser = req.body;

//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser)
//   } else {
//     res.status(400).send('User needs name')
//   }
// });

// updating user info 
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   let user = users.find( user => user.id == id);

//   if (user){
//     user.name = updatedUser.name;
//     res.status(200).json(user)
//   } else {
//     res.status(400).send('User not found')
//   }
  
// });

// Adding a movie to users favorite 
// app.post('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find( user => user.id == id);

//   if (user){
//     user.favoriteMovies.push(movieTitle);
//     res.status(200).send('Movie has been added to favorites');
//   } else {
//     res.status(400).send('Error adding movie to favorites')
//   }
// });

// Deleting a movie from users favorites 
// app.delete('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;

//   const user = users.find( user => user.id == id);

//   if (user) {
//       user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
//       res.status(200).send('Movie has been removed from favorites');
//   } else {
//     res.status(400).send('Error removing movie from favorites')
//   }
// });

// Deleting users account 
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;

//   const user = users.find( user => user.id == id);

//   if (user) {
//       users = users.filter( user => user.id != id );
//       res.status(200).send('User has been deleted');
//   } else {
//     res.status(400).send('Error deleting user')
//   }

// });

// error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
// server 
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});











