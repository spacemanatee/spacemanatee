var request = require('request');
var yelp = require('./yelp');
var key = require('./api/api_key');


var yelpClient = yelp.createClient({
  consumer_key: key.consumer_key,
  consumer_secret: key.consumer_secret,
  token: key.token,
  token_secret:  key.token_secret,
  ssl: key.ssl
});



var locationArray=[];


var searchYelp = function (req, res, yelpProperty) {

  yelpClient.search({term: "food", limit: 10, ll: "37.788022,-122.399797", sort: 2}, function(error, data) {
    //console.log(error);
    for (var i = 0; i < data['businesses'].length; i++) {
      console.log(data['businesses'][i]['name']);
    }
    res.end(JSON.stringify(data));
  }); 

}

var performSearch = function(req, res) {
  console.log('in side request handler');
  
  // first call google map api to get the longitude and latitude arrays along the path
  // store the path (longitude and latitude) in array (locationArray);

  // 
  searchYelp(req, res, null);
}

/* yelpProperty = {
  term: "food",
  limit: 10,
  ll: ,
  sort: 2,
  ....
}
*/
  





exports.performSearch = performSearch;

