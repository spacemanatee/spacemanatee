var yelp = require('./yelp');
var key = require('../api/api_key');

// create yelp client using Oauth
var yelpClient = yelp.createClient({
  consumer_key: key.consumer_key,
  consumer_secret: key.consumer_secret,
  token: key.token,
  token_secret:  key.token_secret,
  ssl: key.ssl
});

// yelp search parameter configuration
var yelpProperty = {
  term: "food",           // Type of business (food, restaurants, bars, hotels, etc.)
  limit: 20,              // Number of entries returned from each call
  sort: 2,                // Sort mode: 0=Best matched (default), 1=Distance, 2=Highest Rated
  radius_filter: 1609.34  // Search radius: 1 mile = 1609.3 meters
};

// function to use yelp API to get the top choices based on longitude and latitude
module.exports.searchYelp = function (req, res, googleCoords, callback) {
  //Counter variable which will keep track of how many Yelp calls have completed
  //A separate counter is needed due to the asynchronous nature of web requests
  var counter = 0;
  // Array that stores all of the Yelp results from all calls to Yelp
  var yelpResults = [];

  //Request yelp for each point along route that is returned by filterGoogle.js
  for(var i = 0; i < googleCoords.length; i++){
    //yelpClient.search is asynchronous and so we must use a closure scope to maintain the value of i
    (function(i) {
      yelpClient.search({
        term: yelpProperty.term,
        limit: yelpProperty.limit,
        sort: yelpProperty.sort,
        radius_filter:yelpProperty.radius_filter,
        ll: googleCoords[i]
      }, function(error, data) {
        if (error) {
          console.log(error);
        }
        //Push the data returned from Yelp into yelpResults array
        yelpResults[i] = data;
        counter++;
        //After all yelp results are received call callback with those results
        if(counter === googleCoords.length){
          callback(yelpResults);
        }
     });
    })(i);
  }
};

//Filter results returned from Yelp into an overall top 10
module.exports.createTopResultsJSON = function(yelpResults) {
  var topResults = [];
  var index = 0;
  var length = yelpProperty.limit || 0;
  var idealLength = 10;

  while(index < idealLength && index < length) {
    var name = yelpResults[0]['businesses'][index]['name'];
    var address = yelpResults[0]['businesses'][index]['location']['display_address'];
    var rating = yelpResults[0]['businesses'][index]['rating'];
    var review_count = yelpResults[0]['businesses'][index]['review_count'];

    //console.log("INDEX " + index, yelpResults[0]['businesses'][index]);
    //console.log(">>> " + name + ": ", address);
    //console.log("--> rating: " + rating + "  review_count: " + review_count);

    // STILL NEEDS ADDITIONAL FILTERS, EX:

    // IF ( rating >= 4 && review_count > 50 )
    // More changes to come...   ~Paul
    topResults.push(yelpResults[0]['businesses'][index]);
    index++;
  }
  console.log("topResults: ", topResults);

  var result = {
    results: topResults
  };

  return result;
}
