var requestHandler = require('./request-handler');
var filter = require('./filters/filterGoogle');
var express = require('express');
var router = express.Router();

router.post('/search', function(req, res) {
  console.log('(POST "/search") Now searching the Yelp API...');
  // call request-handler to perform the work
  var googleFilterObj=filter(req.body)
  var googleCoords = googleFilterObj.filteredCoords;
  var distance = googleFilterObj.distance;
  requestHandler.performSearch(req, res, googleCoords, distance);
});

router.post('/*', function(req, res) {
  console.log('POST to unknown page - redirecting to homepage.');
  res.redirect('/');
});

router.get('/*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
