//Filter coordinates received from front end POST request
//into a smaller number of coordinates for Yelp requests
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// calculate the distance between 2 waypoints, given their latitudes and longitudes, return distance in miles
function calcDistance(pt1, pt2) {
  var R = 6371; // earth radius, in km
  var lat1= pt1.location.coordinate['latitude']; 
  var lon1= pt1.location.coordinate['longitude'];
  var lat2= pt2.location.coordinate['latitude'];
  var lon2= pt2.location.coordinate['longitude'];


  var dLat = (lat2-lat1).toRad(); 
  var dLon = (lon2-lon1).toRad();
  var lat1 = lat1.toRad();
  var lat2 = lat2.toRad();

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var distance = R * c * 0.621371; // convert distance from km to miles
  return distance;
}

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
