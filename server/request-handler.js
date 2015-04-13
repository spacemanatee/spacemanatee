var request = require('request');
var yelp = require('./yelp');
var key = require('./api/api_key');

// create yelp client using Oauth
var yelpClient = yelp.createClient({
  consumer_key: key.consumer_key,
  consumer_secret: key.consumer_secret,
  token: key.token,
  token_secret:  key.token_secret,
  ssl: key.ssl
});


// dummy testing waypoint array to test the functionality of searchYelp
var locations = [
  ['37.7880, -122.3997'], // SF
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

// yelp search parameter configuration
var yelpProperty = {
  term: "food", // searching food
  limit: 20, // limit only 20 entry
  sort: 2, // sort by "calibrated" rating
  radius_filter: 1609.34 // within 1 miles, or 1609.3 meters radius
};

// data collected from yelp search
var yelpresults = [];

// function to filter the top choices from yelp
var filterYelp = function (){};

// function to use yelp API to get the top choices based on longitude and latitude
var searchYelp = function (req, res, callback) {
  var counter = 0;
  for(var i = 0; i < locations.length; i++){ 
    (function(i) {
      yelpClient.search({term: yelpProperty.term, limit: yelpProperty.limit,
      sort: yelpProperty.sort, radius_filter:yelpProperty.radius_filter, ll: locations[i]},
      function(error, data) {
        yelpresults[i] = data;
        counter++;
        if(counter === locations.length){
          callback();
        } 
     });
    })(i);
  } 
};

var createTopResultsJSON = function(yelpresults) {
  var topResults = [];

  var index = 0;
  var length = yelpProperty.limit || 0;
  var idealLength = 10;
  while(index<idealLength && index<length) {
    var name = yelpresults[0]['businesses'][index]['name'];
    var address = yelpresults[0]['businesses'][index]['location']['display_address'];
    var rating = yelpresults[0]['businesses'][index]['rating'];
    var review_count = yelpresults[0]['businesses'][index]['review_count'];
    
    //console.log("INDEX " + index, yelpresults[0]['businesses'][index]);    
    //console.log(">>> " + name + ": ", address);
    //console.log("--> rating: " + rating + "  review_count: " + review_count);

    // STILL NEEDS ADDITIONAL FILTERS, EX:
    // IF ( rating >= 4 && review_count > 50 ) 
    // More changes to come... ~Paul
    
    topResults.push(yelpresults[0]['businesses'][index]);
    index++;
  }

  return topResults;
}

// function to perform the search 
var performSearch = function(req, res) {
  // first filter the google waypoints
  // store the path (longitude and latitude) in array (locations);
  searchYelp(req, res, function() {
    var topResults = createTopResultsJSON(yelpresults);
    res.end(JSON.stringify(topResults));
    yelpresults = [];
    return topResults;
  });
};

exports.performSearch = performSearch;

