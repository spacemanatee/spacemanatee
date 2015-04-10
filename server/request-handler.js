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



var locationArray=[
  ["37.7880, -122.3997"], // SF
  ['37.7833, -122.4167'], // South SF
  ['37.4292, -122.1381'], // Palo Alto
  ['37.3544, -121.9692'], // Santa Clara
  ['36.9719, -122.0264'], // Santa Cruz
  ['34.4258, -119.7142'], // Santa Barbara,
  ['34.0500, -118.2500'], // Los Angeles
  ['34.0219, -118.4814'], // Santa Monica,
  ['33.6694, -117.8231'], // Irvine
  ['32.7150, -117.1625'] // San Diego
];

var yelpProperty ={
  term: "food", // searching food
  limit: 10, // limit only 10 entry
  sort: 2, // sort by "calibrated" rating
  radius_filter: 1609.34 // within 1 miles, or 1609.3 meters radius
  //ll: '', // latitude, longitude
};

var testCollection=[];

var filterYelp = function (){};

var searchYelp = function (req, res, callback) {
  var counter = 0;
  for (var i=0; i< locationArray.length; i++) { 
    (function(i){
      yelpClient.search({term: yelpProperty.term, limit: yelpProperty.limit,
       sort: yelpProperty.sort, radius_filter:yelpProperty.radius_filter, ll: locationArray[i]},
       function(error, data) {
        for (var j = 0; j < data['businesses'].length; j++) {
         console.log(data['businesses'][j]['name']);
        }
      testCollection[i]=[data];
      console.log('!!!!!!done for this location');
      counter++;
      if (counter === locationArray.length) {
        callback();
      } 
     });
    })(i);
  } 
}

var performSearch = function(req, res) {
  console.log('in side request handler');
  
  // first call google map api to get the longitude and latitude arrays along the path
  // store the path (longitude and latitude) in array (locationArray);

  // 
  searchYelp(req, res, function() {
    res.end(JSON.stringify(testCollection));
    testCollection = [];
  });
}


  





exports.performSearch = performSearch;

