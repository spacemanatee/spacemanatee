var requestHandler = require('./request-handler');
var express = require('express');
var router = express.Router();

router.post('/search', function(req, res) {
  console.log('(POST "/search") Now searching the Yelp API...');
  // call request-handler to perform the work
  requestHandler.performSearch(req, res);
  //res.end();
});

router.get('/search', function(req, res) {
  console.log('GET "/search" unknown - redirecting to homepage.');
  res.redirect('/');
});

router.post('/*', function(req, res) {
  console.log('POST to unknown page - redirecting to homepage.');
  res.redirect('/');
});

router.get('/*', function (req, res) {
  console.log('GET to unknown page - redirecting to homepage.');
  res.redirect('/');
});

module.exports = router;

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