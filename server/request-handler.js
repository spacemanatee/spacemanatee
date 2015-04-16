var request = require('request');
var yelpHelper = require('./helpers/yelpFunctions');

// function to perform the search
var performSearch = function(req, res, googleCoords, distance) {
  yelpHelper.searchYelp(req, res, googleCoords, distance, function(yelpResults) {
    var topResults = yelpHelper.createTopResultsJSON(yelpResults, distance);
    //Return overall top 10 data in the body of the web response
    res.end(JSON.stringify(topResults));
  });
};

exports.performSearch = performSearch;

