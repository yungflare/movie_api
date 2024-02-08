const express = require('express');
const app = express();

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.get('/movies', (req, res) => {
  res.send('My Top 10 Movies : ');
});

app.get('/', (req, res) => {
  res.send('This is the endpoint! ');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
