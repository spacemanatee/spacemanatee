'use strict'

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

// yelp search parameter configuration
var yelpProperty = {
  term: "food",           // Type of business (food, restaurants, bars, hotels, etc.)
  limit: 20,              // Number of entries returned from each call
  sort: 2,                // Sort mode: 0=Best matched (default), 1=Distance, 2=Highest Rated
  radius_filter: 1609.34  // Search radius: 1 mile = 1609.3 meters
};

// function to use yelp API to get the top choices based on longitude and latitude
var searchYelp = function (req, res, googleCoords, callback) {
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
var getYelpLocations = function(yelpResults, totalYelpSections) {

  // Copy all of this location's results, into tempResults.
  var sectionResults = [];
  var maxResults = parseInt(yelpProperty['limit']) || 0;
  for (var s = 0; s < totalYelpSections; s++) {
    console.log("TRIP SEGMENT:  " + s);
    if(!yelpResults[s] || yelpResults[s]===undefined || yelpResults[s]['businesses']===undefined || yelpResults[s]['businesses'].length==0) { 
      console.log("Skipping:  No valid locations found in road segment " + s);
    } else {
      var index = 0;
      if(yelpResults[s]['businesses'] && yelpResults[s]['businesses'].length>0) {
        while(index<maxResults) {
          if(yelpResults[s]['businesses'][index]!==undefined) {
            console.log(" --> " + yelpResults[s]['businesses'][index]['name'] + ", ", yelpResults[s]['businesses'][index]['location']['display_address']);
            sectionResults.push(yelpResults[s]['businesses'][index]);
          }
          index++;
        }
      }
    }
  }
  return sectionResults;
}

var createTopResultsJSON = function(yelpResults) {
  var allYelpLocations = [];
  var finalResults = [];
  var minRating = 4;

  // Collect Yelp results for all trip sections.
  allYelpLocations = getYelpLocations(yelpResults, 10);

  // Select random points of interest
  var count = 0;
  var totalFound = 0;
  console.log("TOTAL LOCATIONS ==> " + allYelpLocations.length);
  while(count<allYelpLocations.length && totalFound<10) {
    var randIndex = Math.floor(Math.random() * (allYelpLocations.length-1));
    console.log("Random #" + randIndex + " = " + allYelpLocations[randIndex].name + "; " + allYelpLocations[randIndex].location.display_address);
    var aLocation = allYelpLocations[randIndex];
    if(aLocation && aLocation['rating'] && parseInt(aLocation['rating'])>=minRating ) {
      finalResults.push(aLocation);
      allYelpLocations.splice(count, 1);
    }
    totalFound++;
    count++;
  }
  // finalResults = allYelpLocations;
  console.log("Found " + finalResults.length + " final locations.");

  var result = {
    results: finalResults
  };

  return result;
};


// function to perform the search
var performSearch = function(req, res, googleCoords) {
  //searchYelp function will query yelp API with the filtered locations from filterGoogle.js
  searchYelp(req, res, googleCoords, function(yelpResults) {
    //The callback will call createTopResultsJSON which filters all the results into an overall top 10
    var topResults = createTopResultsJSON(yelpResults);
    //Return overall top 10 data in the body of the web response
    res.end(JSON.stringify(topResults));
  });
};

exports.performSearch = performSearch;

