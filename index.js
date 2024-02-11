const express = require('express');
const  morgan = require('morgan');
const bodyParser = require('body-parser');
const  methodOverride = require('method-override');

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
  // res.json(movies);
  res.send('List of all movies');
});

// getting a movie by title 
app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = movies.find(movie => movie.title === title);
  if (movie) {
    res.send('Data about a movie by title');
    // res.json(movie);
  }else {
    res.status(404).send('Movie not found');
  }
});

// getting data about a genre by name / title 
app.get('/genres/:name', (req, res) => {
  const name = req.params.name;
  res.send('Data about a genre by name/title ');
});

// getting data about a director by name 
app.get('/directors/:name', (req, res) => {
  const name = req.params.name;
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
app.delete('/users/id:/favorites/:movieId', (req, res) => {
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












// code for exercise 2.4 

// app.get('/movies', (req, res, next) => {
//    res.json(topMovies);
// });
  
// app.get('/', (req, res) => {
//   res.send('This is the endpoint! ');
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });


