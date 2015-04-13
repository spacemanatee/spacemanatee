var requestHandler = require('./request-handler');
var express = require('express');
var router = express.Router();

router.post('/search', function(req, res) {
  console.log('(POST "/search") Now searching the Yelp API...');
  res.end(requestHandler.performSearch(req, res));
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
