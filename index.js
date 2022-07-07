require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const router = express.Router();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({
    greeting: 'hello API'
  });
});


const createAndSaveUrl = require("./myApp.js").createAndSaveUrl;

app.post('/api/shorturl', function(req, res) {
  let originalUrl = req.body.url;

  createAndSaveUrl(originalUrl, function(err, data) {
    if (err) {
      res.json({
        error: err
      });
    } else {
      res.json(data);
    }
  });
});


const findOneByShortUrl = require("./myApp.js").findOneByShortUrl;

app.get('/api/shorturl/:shortUrl', function(req, res) {
  let shortUrl = req.params.shortUrl;
  findOneByShortUrl(shortUrl, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.redirect(307, data);
    }
  })
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
