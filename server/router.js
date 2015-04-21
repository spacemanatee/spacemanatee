var requestHandler = require('./request-handler');
var filter = require('./filters/filterGoogle');
var express = require('express');
var router = express.Router();
var path = require('path');

router.post('/search', function(req, res) {
  console.log('(POST "/search") Now searching the Yelp API...');
  //call the google filter to return only the points along the route that are n distance apart
  var googleFilterObj = filter(req.body);

  var googleCoords = googleFilterObj.filteredCoords;
  var distance = googleFilterObj.distance;

  requestHandler.performSearch(req, res, googleCoords, distance);
});

router.get('/main', function (req, res) {
  res.sendFile(path.join(__dirname,'../client', 'main.html'));
});

router.post('/*', function(req, res) {
  console.log('POST to unknown page - redirecting to homepage.');
  res.redirect('/');
});

router.get('/*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
