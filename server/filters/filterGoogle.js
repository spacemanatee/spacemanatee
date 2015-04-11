//Filter coordinates received from front end POST request
//into a smaller number of coordinates for Yelp requests

//Google also returns total distance value in meters which may be
//useful in determining how far apart the yelp requests should be

var filter = function(coordObj){
  //coordArray is the overview_path array from Google

  filteredCoords = [];

  //start the loop 10% along the trip so we don't return results
  //in the area where the trip starts
  /*
  for(var i = Math.floor(coordArray.length / 10); i < coordArray.length;i){
    filteredCoords.push(coordArray[i]);
    //check yelp every 10% of the journey (for testing purposes)
    i *= 10;
  }
  */

  var key = 1;
  while (key in coordObj) {
    filteredCoords.push(coordObj[key]);
    key += 20;
  }
  return filteredCoords;
}

module.exports = filter;