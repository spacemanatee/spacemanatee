//Filter coordinates received from front end POST request
//into a smaller number of coordinates for Yelp requests

//Google also returns total distance value in meters which may be
//useful in determining how far apart the yelp requests should be

var filter = function(requestBody){
  //coordArray is the overview_path array from Google

  //The best way to ensure we get every part of the road would be to use the total trip distance
  //and divide that by the number of coordinates in coordObj.  This would give us the distance
  //between each coordinate allowing us to determine how many/which coordinates we want to send
  //to yelp

  var distance = requestBody.distance;
  var coordObj = requestBody.waypoints;

  //The distance between each yelp query in miles (i.e. Yelp will be queried every 10 miles along the route)
  var distanceBetweenQueries = 10;

  //parse distance into an int
  distance = distance.replace(/\,/g,"").split(" ");
  distance = parseInt(distance[0]);

  //Convert coordObj from an object to an array to calculate distance between points
  var coordArray = [];
  for(var key in coordObj){
    coordArray.push(coordObj[key]);
  }

  var distanceBetweenPoints = distance / coordArray.length;

  var counter = 0;
  var filteredCoords = [];

  //Loop through array and only push the coordinates that are distanceBetweenQueries apart
  for (var i = 0; i < coordArray.length; i++){
    if(counter > distanceBetweenQueries){
      filteredCoords.push(coordArray[i]);
      counter = 0;
    } else {
      counter += distanceBetweenPoints;
    }
  }

  return filteredCoords;
}

module.exports = filter;
