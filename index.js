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


app.get('/movies', (req, res, next) => {
   res.json(topMovies);
});
  
app.get('/', (req, res) => {
  res.send('This is the endpoint! ');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});


