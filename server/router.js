var requestHandler = require('./request-handler');
var express = require('express');
var router = express.Router();

/*
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
*/


console.log('in router!');


router.post('/search', function(req, res) {
  console.log('now searching google API and then Yelp');
  // call request-handler to perform the work
  //requestHandler.performSearch(req, res);
  res.end();
  
});



router.get('/search', function(req, res) {
  console.log('now searching google API and then Yelp');
  //requestHandler.performSearch(req, res);
  res.end();
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



