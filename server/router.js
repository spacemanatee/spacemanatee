var requestHandler = require('./request-handler');
var express = require('express');
var router = express.Router();

router.post('/search', function(req, res) {
  // call request-handler to perform the work
  requestHandler.performSearch(req, res);
});

router.get('/search', function(req, res) {
  requestHandler.performSearch(req, res);
});

router.post('/*', function(req, res) {
  res.redirect('/');
});

router.get('/*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
