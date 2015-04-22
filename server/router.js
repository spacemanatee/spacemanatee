var requestHandler = require('./request-handler');
var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('./authentication/authentication');
var loggedIn = require('./authentication/utility').loggedIn;

router.get('/main/auth', passport.authenticate('facebook'));
router.get('/main/auth/success',
     passport.authenticate('facebook', {successRedirect:'/main',
                                        failureRedirect:'/main'}));


router.post('/search', function(req, res) {
  console.log('(POST "/search") Now searching the Yelp API...');

  var googleCoords = req.body.waypoints;
  var distance = req.body.distance;

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
