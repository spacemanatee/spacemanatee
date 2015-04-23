// define the to Radian function
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// calculate the distance between 2 waypoints, given their latitudes and longitudes, return distance in miles
module.exports.calcDistance = function(pt1, pt2) {
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

