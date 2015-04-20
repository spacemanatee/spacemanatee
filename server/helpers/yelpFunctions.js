var yelp = require('./yelp');
var key = require('../api/api_key');

// create yelp client using Oauth
var yelpClient = yelp.createClient({
  consumer_key: process.env.KEY || key.consumer_key,
  consumer_secret: process.env.CONSUMER_SECRET || key.consumer_secret,
  token: process.env.TOKEN || key.token,
  token_secret: process.env.TOKEN_SECRET || key.token_secret,
  ssl: process.env.SSL || key.ssl
});

// yelp search parameter configuration
var yelpProperty = {
  term: "food",           // Type of business (food, restaurants, bars, hotels, etc.)
  limit: 10,              // Number of entries returned from each call
  sort: 2,                // Sort mode: 0=Best matched (default), 1=Distance, 2=Highest Rated
  radius_filter: 5*1609.34  // Search radius: 1 mile = 1609.3 meters, 5 miles is good for rural areas
};

// define the to Radian function
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// calculate the distance between 2 waypoints, given their latitudes and longitudes, return distance in miles
function calcDistance(pt1, pt2) {
  var R = 6371; // earth radius, in km
  var lat1 = pt1.location.coordinate['latitude'];
  var lon1 = pt1.location.coordinate['longitude'];
  var lat2 = pt2.location.coordinate['latitude'];
  var lon2 = pt2.location.coordinate['longitude'];


  var dLat = (lat2 - lat1).toRad();
  var dLon = (lon2 - lon1).toRad();
  var lat1 = lat1.toRad();
  var lat2 = lat2.toRad();

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c * 0.621371; // convert distance from km to miles
  return distance;
}

function isAlreadyInArray(array, target) {
  for (var i = 0 ; i < array.length; i++) {
    if (array[i].name === target.name) {
      return true;
    }
  }
  return false;
}

var commonFilter=["McDonald's", "Burger King", "Jack in the Box", "Carl's Junior", "StarBucks", "Subway",
"Pizza Hut", "Del Taco", "Taco Bell", "Chick-fil-A", "Farm", "Truck", "In-N-Out"];

// check if a place is a common place to be filtered out
function isCommonPlace(businessEntry, commonFilter){
  for (var i = 0; i < commonFilter.length; i++) {
    if (businessEntry.name.indexOf(commonFilter[i]) > -1)
      return true;
  }
  return false;
}

// parse google coordinate into {latitude:..., longitude: ... } format
function parseGoogleCoord(googleCoord) {
  var latitude = parseFloat(googleCoord.match(/^.*,/)[0].replace(",", ""));
  var longitude = parseFloat(googleCoord.match(/,.*$/)[0].replace(",", ""));
  var obj = {
    location: {
      coordinate : {
        latitude: latitude,
        longitude: longitude
      }
    }
  }
  return obj;
}

// trim the google waypoint coordinate to take out start and end way point so no clustering at 2 ends.
function trimGoogleCoord(googleCoords, distance) {
  var trimmedCoords = [];
  //Loop through array and only push the coordinates that are distanceBetweenQueries apart

  if (googleCoords.length > 5) {
    for (var i=0; i<googleCoords.length; i++) {
      if (calcDistance(parseGoogleCoord(googleCoords[i]), parseGoogleCoord(googleCoords[0])) >= distance/20 &&
        calcDistance(parseGoogleCoord(googleCoords[i]), parseGoogleCoord(googleCoords[googleCoords.length-1])) >= distance/20) {
        trimmedCoords.push(googleCoords[i]);
      }
    }
  } else {
    trimmedCoords = googleCoords;
  }

  return trimmedCoords;
}

// function to use yelp API to get the top choices based on longitude and latitude
module.exports.searchYelp = function (req, res, googleCoords, distance, callback) {
  //Counter variable which will keep track of how many Yelp calls have completed
  //A separate counter is needed due to the asynchronous nature of web requests
  var trimmedCoords= trimGoogleCoord(googleCoords, distance);
  var counter = 0;
  // Array that stores all of the Yelp results from all calls to Yelp
  var yelpResults = [];

  // yelp search parameter configuration
  yelpProperty.term = req.body.optionFilter;           // Type of business (food, restaurants, bars, hotels, etc.)

  if (distance <= 20) {
    yelpProperty.radius_filter = 0.8*1609.34 ;
  } else if (distance <= 40) {
    yelpProperty.radius_filter = 2.5*1609.34;
  } else {
    yelpProperty.radius_filter = 5*1609.34;
  }

  //Request yelp for each point along route that is returned by filterGoogle.js
  for(var i = 0; i < trimmedCoords.length; i++){
    //yelpClient.search is asynchronous and so we must use a closure scope to maintain the value of i
    (function(i) {
      yelpClient.search({
        term: yelpProperty.term,
        limit: yelpProperty.limit,
        sort: yelpProperty.sort,
        radius_filter: yelpProperty.radius_filter,
        ll: trimmedCoords[i]
      }, function(error, data) {
        if (error) {
          console.log(error);
        }
        //Push the data returned from Yelp into yelpResults array
        yelpResults[i] = data;
        counter++;
        //After all yelp results are received call callback with those results
        if(counter === trimmedCoords.length){
          callback(yelpResults);
        }
     });
    })(i);
  }
};

//Filter results returned from Yelp into an overall top 10
module.exports.createTopResultsJSON = function(yelpResults, distance) {
  var allBusinesses = [];
  var topResults = [];
  var minRating = 0;
  var evenSpreadResults =[];

  //Push all businesses from yelpResults into one array for easy filtering
  for(var i = 0; i < yelpResults.length; i++){
    if(yelpResults[i].businesses){
      allBusinesses = allBusinesses.concat(yelpResults[i].businesses);
    }
  }
  //loop through each business and compare ratings, only push the overall top 10 into topResults
  for(var j = 0;j < allBusinesses.length; j++){
    //yelp includes some highly rated businesses well outside of the search radius, possibly a "featured business"
    //if such a business is included, skip over it
    if(allBusinesses[j].distance > yelpProperty.radius_filter){
      continue;
    }
    //Push the first 10 businesses into topResults
    if(topResults.length < 10){
      topResults.push(allBusinesses[j]);
    } else {
      //compare ratings
      for(var k = 0; k < topResults.length; k++){
        // if the business is not already in the topResults;
        // if not in the topResults, then proceed with comparing, else, skip the current business entry
        if (!isAlreadyInArray(topResults, allBusinesses[j])) {
          //Check rating
          if(allBusinesses[j].rating > topResults[k].rating){
            topResults[k] = allBusinesses[j];
            //once a business is added to topResults, move on to the next business
            break;
            //if ratings are equal, choose the business with higher number of reviews
          } else if(allBusinesses[j].rating === topResults[k].rating && allBusinesses[j].review_count > topResults[k].review_count){
            topResults[k] = allBusinesses[j];
            //once a business is added to topResults, move on to the next business
            break;
          }
        }
      }
    }
  }

  // start the evenSpread algorithm to create a new array of results, which will be combined later with the topResults
  var startingCoord;  // keep track of starting coordinates
  evenSpreadResults[0] = allBusinesses[1]; // push the starting point result to the array
  var n = 0;

  for (var m = 1; m < allBusinesses.length; m) {
    // if next waypoint less than total distance/20 mi away
    if (calcDistance(evenSpreadResults[n], allBusinesses[m]) < (distance / 20)) {
      // then skip
      m++;
    }
    else { // if the next waypoint is greater than distance/20 mi away
      if (allBusinesses[m].distance > yelpProperty.radius_filter || allBusinesses[m].rating < 4 ||
        allBusinesses[m].review_count < 5 || isCommonPlace(allBusinesses[m], commonFilter)) {
        // if the business distance is out of the searching radius,
        // or if the rating is less than 4
        // or if the review count is less than 5
        // or if the place is deemed a common place deemed by the commonFilter
        // then skip
        m++;
      }
      else {
        // push the result to the array, start looking for the next entry
        n++;
        evenSpreadResults[n] = allBusinesses[m];
        m++;
      }
    }
    if (n >= 20 || m >= allBusinesses.length) { // if have 20 entries , exit the for loop
      break;
    }
  }

  // combine the best results along the road with the even spread results along the roads
  var finalResults = evenSpreadResults.concat(topResults);

  var result = {
    results: finalResults,
    topTen: topResults
  };
  return result;
}
