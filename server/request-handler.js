var request = require('request');
var yelpHelper = require('./helpers/yelpFunctions');

// function to perform the search
var performSearch = function(req, res, googleCoords) {
  // first filter the google waypoints
  // store the path (longitude and latitude) in array (locations);
  yelpHelper.searchYelp(req, res, googleCoords, function(yelpResults) {
    var topResults = yelpHelper.createTopResultsJSON(yelpResults);
    console.log(topResults);
    //Return overall top 10 data in the body of the web response
    res.end(JSON.stringify(topResults));
  });
};

exports.performSearch = performSearch;

