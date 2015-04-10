//var yelpKey = require('./api/api_key');
var request = require('request');
var yelp = require('./yelp');


var yelpClient = yelp.createClient({
  consumer_key: yelpKey.consumer_key,
  consumer_secret: yelpKey.consumer_secret,
  token: yelpKey.token,
  token_secret:  yelpKey.token_secret,
  ssl: true
});




exports.requestYelp = function(req, res) {
  console.log('in side request handler');
  return res.end();
  /*
  yelpClient.search({term: "food", limit: 3, ll: "37.788022,-122.399797"}, function(error, data) {
  console.log(error);
  console.log(data);
  res.send(data);
  res.end();
  }); 
*/
}


