//Filter coordinates received from front end POST request
//into a smaller number of coordinates for Yelp requests

var filter = function(requestBody){
  var distance = requestBody.distance;  //Total trip distance
  var coordObj = requestBody.waypoints; //All of the coordinate points along the route returned by Google

  //The distance between each yelp query in miles (i.e. Yelp will be queried every 10 miles along the route)
  var distanceBetweenQueries = 10;

  //parse distance from string into int
  distance = distance.replace(/\,/g,"").split(" ");
  distance = parseInt(distance[0]);

  //Convert coordObj from an object to an array to calculate distance between points
  var coordArray = [];
  for(var key in coordObj){
    coordArray.push(coordObj[key]);
  }

  //The coordArray points are not equally distant from one another so distanceBetweenPoints is an approximate value
  var distanceBetweenPoints = distance / coordArray.length;

  var counter = 0;
  var filteredCoords = [];
  //Loop through each coordinate along the route and only add the coordinates that are distanceBetweenQueries apart
  for (var i = 0; i < coordArray.length; i++){
    if(counter > distanceBetweenQueries){
      filteredCoords.push(coordArray[i]);
      counter = 0;
    } else {
      counter += distanceBetweenPoints;
    }
  }

  return {
    distance: distance,
    filteredCoords:filteredCoords
  }
}

module.exports = filter;
