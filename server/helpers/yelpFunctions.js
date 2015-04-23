var yelp = require('./yelp');
var key = require('../api/api_key');
var coord = require('./coordinateHelpers');

// create yelp client using Oauth
var yelpClient = yelp.createClient({
  consumer_key: process.env.KEY || key.consumer_key,
  consumer_secret: process.env.CONSUMER_SECRET || key.consumer_secret,
  token: process.env.TOKEN || key.token,
  token_secret: process.env.TOKEN_SECRET || key.token_secret,
  ssl: process.env.SSL || key.ssl
});

// Yelp search parameter configuration defaults
var yelpProperty = {
  term: "food",             // Type of business (food, restaurants, bars, hotels, etc.)
  limit: 10,                // Number of entries returned from each call
  sort: 2,                  // Sort mode: 0=Best matched (default), 1=Distance, 2=Highest Rated
  radius_filter: 5*1609.34  // Search radius: 1 mile = 1609.3 meters, 5 miles is good for rural areas
};

function isAlreadyInArray(array, target) {
  for (var i = 0 ; i < array.length; i++) {
    if (array[i].name === target.name) {
      return true;
    }
  }
  return false;
}

// check if a place is a common place to be filtered out
var commonFilter = ["McDonald's", "Burger King", "Jack in the Box", "Carl's Junior", "StarBucks", "Subway",
"Pizza Hut", "Del Taco", "Taco Bell", "Chick-fil-A", "Farm", "Truck", "In-N-Out"];

function isCommonPlace(businessEntry, commonFilter){
  for (var i = 0; i < commonFilter.length; i++) {
    if (businessEntry.name.indexOf(commonFilter[i]) > -1)
      return true;
  }
  return false;
}

// function to use yelp API to get the top choices based on longitude and latitude
module.exports.searchYelp = function (req, res, googleCoords, distance, callback) {
  //Counter variable which will keep track of how many Yelp calls have completed
  //A separate counter is needed due to the asynchronous nature of web requests
  var counter = 0;
  // Array that stores all of the Yelp results from all calls to Yelp
  var yelpResults = [];

  // yelp search parameter configuration
  yelpProperty.term = req.body.optionFilter;           // Type of business (food, restaurants, bars, hotels, etc.)

  if (distance <= 20) {
    yelpProperty.radius_filter = (distance/10) * 1609.34;
    // 500 mile trip = 25 mile radius (checked every 25 mi)
  } else if (distance <= 500) {
    yelpProperty.radius_filter = (distance/20) * 1609.34;
  } else {
    // yelp max radius is 25 mi
    yelpProperty.radius_filter = 25 * 1609.34;
  }

  //Request yelp for each point along route that is returned by filterGoogle.js
  for(var i = 0; i < googleCoords.length; i++){
    //yelpClient.search is asynchronous and so we must use a closure scope to maintain the value of i
    (function(i) {
      yelpClient.search({
        term: yelpProperty.term,
        limit: yelpProperty.limit,
        sort: yelpProperty.sort,
        radius_filter: yelpProperty.radius_filter,
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
module.exports.createTopResultsJSON = function(yelpResults, distance, limit) {
  limit = limit || 10;
  var allBusinesses = [];
  var topResults = [];
  var invalidBusinesses = [];
  var invalidLength;
  var remainingBusinesses = [];

  // push all businesses from yelpResults into array
  for(var i = 0; i < yelpResults.length; i++){
    if(yelpResults[i].businesses){
      allBusinesses = allBusinesses.concat(yelpResults[i].businesses);
    }
  }
  var allLength = allBusinesses.length;

  for (var i = 0 ; i < allLength; i++){
    // set those outside the search radius to be discarded
    if (allBusinesses[i].distance > yelpProperty.radius_filter){
      invalidBusinesses.push(allBusinesses[i]);
    }
  }

  invalidLength = invalidBusinesses.length;

  for (var i = 0 ; i < allLength; i++){
    // if remaining businesses > 50, set those with fewer than 4 stars to be discarded
    if (allLength - invalidLength > 50 && allBusinesses[i].rating < 4 ){
      invalidBusinesses.push(allBusinesses[i]);
    }
  }

  invalidLength = invalidBusinesses.length;

  for (var i = 0 ; i < allLength; i++){
    // if remaining businesses > 50, set those with fewer than 5 reviews to be discarded
    if (allLength - invalidLength > 50 && allBusinesses[i].review_count < 5){
      invalidBusinesses.push(allBusinesses[i]);
    }
  }

  invalidLength = invalidBusinesses.length;

  // remove invalid businesses
  for (var i = 0 ; i < allLength ; i++){
    var valid = true;
    for (var j = 0 ; j < invalidLength ; j++){
      if (allBusinesses[i].id === invalidBusinesses[j].id){
        var valid = false;
      }
    }
    if (valid === true){
      remainingBusinesses.push(allBusinesses[i]);
    }
  }


  // sort remaining results based on rating
  remainingBusinesses.sort(function compareNumbers(a, b) {
  return b.rating - a.rating;
  })

  // loop from highest to lowest
  for (var i = 0 ; i < remainingBusinesses.length ; i++){
    if (topResults.length < limit){
      var pushIt = true;
      // loop through top 10
      for (var j = 0 ; j < topResults.length ; j++){
        // if business is not too close to an existing top 10 business, add to top 10
        if (coord.calcDistance(remainingBusinesses[i], topResults[j]) < (distance / 20) ){
          pushIt = false;
        }
      }
      if (pushIt === true){
        topResults.push(remainingBusinesses[i]);
      }
    }
  }

  // The previous group had two groups, results (which had pin drops) and topTen (which showed in list). We are using our new top 10 for both groups.
  var result = {
    results: topResults,
    topTen: topResults
  };

  return result;

};


