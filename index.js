const express = require('express');
const  morgan = require('morgan');
const  methodOverride = require('method-override');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let topMovies = [
  {
    title:'Shrek',
    director:'Andrew Adamson',
    genre:'Animation'
  },
  {
    title:'Fight Club',
    director:'David Fincher',
    genre:'Drama'
  },
  {
    title:'Finding Nemo',
    director:'Andrew Stanton',
    genre:'Animation'
  },
  {
    title:'Halloween',
    director:'David Gordon Green',
    genre:'Thriller'
  },
  {
    title:'Half Baked',
    director:'Tamra Davis',
    genre:'Comedy'
  },
  {
    title:'Paid in Full',
    director:'Charles Stone III',
    genre:'Crime'
  },
  {
    title:'Boyz n the Hood',
    director:'John Singleton',
    genre:'Crime'
  },
  {
    title:'Juice',
    director:'Ernest Dickerson',
    genre:'Crime'
  },
  {
    title:'Fractured',
    director:'Brad Anderson',
    genre:'Thriller'
  },
  {
    title:'A Silent Voice',
    director:'Naoko Yamada',
    genre:'Romance'
  },
];

let movies = [
  {
    title:'AIR',
    description:'Sonny Vaccaro and Nike pursue basketball rookie Michael Jordan, creating a partnership that revolutionizes the world of sports and contemporary culture.',
    director: {
      name: 'Ben Affleck',
      bio:'Benjamin Géza Affleck is an American actor and filmmaker. He is the recipient of many accolades including two Academy Awards, two BAFTA Awards, and three Golden Globes. Affleck began his career as a child when he starred in the PBS educational series The Voyage of the Mimi',
      lifespan:'August 15,1972 - Current'
    },
    genre:{
      name: 'Drama',
      description:'Drama movies are serious, exciting stories that are more about telling an interesting story than being entertaining',
    }
  },
  {
    title:'M3GAN',
    director: {
      name:'Gerard Johnstone',
      bio:'Gerard Johnstone is a New Zealand screenwriter and director. He is known for the comedy sitcom series The Jaquie Brown Diaries and the horror films Housebound and M3GAN.',
      lifespan:'March 4,1976 - Current'
    },
    genre:{
      name:'Horror',
      description:'Horror movies are intended to scare, shock, and startle audiences. They often deal with the dark side of life, such as fears, nightmares, and alienation.',
    }
  },
  {
    title:'Past Lives',
    director: {
      name:'Celine Song',
      bio:'Celine Song is a Korean-Canadian director, playwright, and screenwriter based in the United States. Among her plays are Endlings and The Seagull on The Sims 4. Her directorial film debut Past Lives was nominated for several accolades including Best Picture and Best Original Screenplay at the 96th Academy Awards',
      lifespan:'September 19, 1988 - Current'
    },
    genre:{
    name:'Romance',
    description:'Romance movies are a genre of film that focus on the love between two or more characters. They often feature a warm, caring relationship between the main characters, and may highlight their engagement, wedding, or relationship. ',
    }
  },
];

let users = [
  {
    id: 1,
    name: 'Joe Kenda',
    favoriteMovies:['M3GAN, AIR']
  },
  {
    id: 2,
    name: 'Russell Westbrook',
    favoriteMovies:['AIR']
  },
  {
    id: 3,
    name: 'Amy Hoyos',
    favoriteMovies:['AIR']
  }
];

let myLogger = (req,res,next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);
app.use(morgan('common'));
app.use(express.static('public'));

app.use(methodOverride());

// Get list of all movies 
app.get('/movies', (req,res) => {
  res.json(movies);
})

// getting a movie by title 
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title );
  
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('No movies found.');
  }
});

// getting movie by  genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name === genreName);
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('No movies found for this genre.');
  }
});

// getting data about a director by name 
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName);
  
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('Director not found');
  }
});

 // registration for users 
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('User needs name')
  }
});

// updating user info 
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user){
    user.name = updatedUser.name;
    res.status(200).json(user)
  } else {
    res.status(400).send('User not found')
  }
  
});

// Adding a movie to users favorite 
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user){
    user.favoriteMovies.push(movieTitle);
    res.status(200).send('Movie has been added to favorites');
  } else {
    res.status(400).send('Error adding movie to favorites')
  }
});

// Deleting a movie from users favorites 
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  const user = users.find( user => user.id == id);

  if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send('Movie has been removed from favorites');
  } else {
    res.status(400).send('Error removing movie from favorites')
  }
});

// Deleting users account 
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const user = users.find( user => user.id == id);

  if (user) {
      users = users.filter( user => user.id != id );
      res.status(200).send('User has been deleted');
  } else {
    res.status(400).send('Error deleting user')
  }

});

// error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
// server 
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});











