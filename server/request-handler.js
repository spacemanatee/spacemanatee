var request = require('request');
var yelpHelper = require('./helpers/yelpFunctions');

//Query yelp along the route with the coordinates returned by the googlefilter function
var performSearch = function(req, res, googleCoords, distance, limit) {
  yelpHelper.searchYelp(req, res, googleCoords, distance, function(yelpResults) {
    //yelpResults is the response from all of the yelp queries along the route
    //Filter all of the yelp results into an overall best with createTopResultsJSON
    var topResults = yelpHelper.createTopResultsJSON(yelpResults, distance, limit);
    //Return overall top 10 data in the body of the web response
    res.end(JSON.stringify(topResults));
  });
};

exports.performSearch = performSearch;
