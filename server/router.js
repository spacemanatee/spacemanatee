var requestHandler = require('./request-handler');
var OAuth = require('oauth').OAuth;
var express = require('express');
var router = express.Router();


router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


console.log('in router!');

router.post('/search', function(req, res) {
  console.log('now searching google API and then Yelp');
  //res.send('now searching google API and then Yelp');
  res.end();
});

router.get('/search', function(req, res) {
  console.log('now searching google API and then Yelp');
  //res.send('now searching google API and then Yelp');
  res.end('now searching google API and then Yelp');
});


router.post('/*', function(req, res) {
  console.log('invalid address');
  res.redirect('/');
});

router.get('/*', function (req, res) {
  console.log('invalid address');
  res.redirect('/');
});


module.exports = router;



