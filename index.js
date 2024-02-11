const express = require('express');
const  morgan = require('morgan');
const bodyParser = require('body-parser');
const  methodOverride = require('method-override');
const uuid = require('uuid');

const app = express();

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
    title:'Oppenheimer',
    director:'Christopher Nolan',
    genre:'History'
  },
  {
    title:'Spider-man: Across the Spider-Verse',
    director:'Joaquim Dos Santos',
    genre:'Adventure'
  },
  {
    title:'AIR',
    director:'Ben Affleck',
    genre:'Sports'
  },
  {
    title:'M3GAN',
    director:'Gerard Johnstone',
    genre:'Horror'
  },
  {
    title:'Past Lives',
    director:'Celine Song',
    genre:'Romance'
  },
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
  }
];

let users = [
  {
    id: 1,
    name: 'Joe Kenda'
  },
  {
    id: 2,
    name: 'Russell Westbrook'
  },
  {
    id: 3,
    name: 'Amy Hoyos'
  }
];

let myLogger = (req,res,next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);
app.use(morgan('common'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

// beginning of express code for 2.5 

// Get list of all movies 
app.get('/movies', (req,res) => {
  res.send('List of all movies');
})

// getting a movie by title 
app.get('/movies/:title', (req, res) => {
  res.send('Data about a movie by title');
});

// getting data about a genre by name / title 
app.get('/movies/genre/:genreName', (req, res) => {
  res.send('Data about a genre by name/title');
})

// getting data about a director by name 
app.get('/movies/directors/:directorName', (req, res) => {
  res.send('Data about a director by name');
});

 // registration for users 
app.post('/users/register', (req, res) => {
  res.send('Confirmation of successful registration');
});

// updating user info 
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send('Confirmation of successful user info update ');
});

// Adding a movie to users favorite 
app.post('/users/:id/favorites', (req, res) => {
  const userId = req.params.id;
  res.send('Confirmation that a movie has been added to favorites');
});

// Deleting a movie from users favorites 
app.delete('/users/:id/favorites/:movieId', (req, res) => {
  const userId = req.params.id;
  const movieId = req.params.movieId;
  res.send('Confirmation that a movie has been removed from favorites');
});

// Deleting users account 
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send('Confirmation of successful deregistration');
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










// If statements for code 
  // res.json(movies);
  // res.json(movies.find( (movie) => {
 //     return movie.title === req.params.title;
// }));
 // const { genreName } = req.params;
  // const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  // if (genre) {
  //   res.status(200).json(genre);
  // }else {
  //   res.status(400).send('Genre not found')
  // }
  // const { directorName } = req.params;
  // const director = movies.find(movie => movie.Director.Name === directorName).Director;

  // if (director) {
  //   res.status(200).json(director);
  // }else {
  //   res.status(400).send('Director not found')
  // }









