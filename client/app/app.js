angular.module('app', ['autofill-directive', 'ngRoute', 'app.service'])
.controller('mapCtrl', ['$scope', '$element', 'Maps', 'Utility', function($scope, $element, Maps, Utility) {
  // initialize the user input option selector
  $scope.optionSelections = [
    {name: 'Everything',  value: ''},
    {name: 'Food',        value: 'food'},
    {name: 'Arts',        value: 'arts'},
    {name: 'Nightlife',   value: 'nightlife'},
    {name: 'Parks',       value: 'parks'},
    {name: 'Shopping',    value: 'shopping'},
    {name: 'Hotels',      value: 'hotels'}
  ];

  $scope.optionFilter;

  // initialize the geoCodeNotSuccessful to be used for determining valid continental destination or not
  $scope.geoCodeNotSuccessful = false;

  // geolocation search

  $scope.useCurrentLocation = function(){
    $('#start').val("Searching for current location...");
    navigator.geolocation.getCurrentPosition(function(position){
    $('#start').val([position.coords.latitude, position.coords.longitude]);
    }, function(){
    $('#start').val("Error retrieving location.");
    });
  };

  // save label selection to scope
  $scope.chooseFilter = function(option) {
    $scope.optionFilter = option.value;
  };

  $scope.appendWarningMsg = function(isInvalid) {
    // invalid message template
    var pInvalid = angular.element("<p id='warningMsg'/>");
    pInvalid.text("Please choose two continental locations");
    // valid message template
    var pValid = angular.element("<p id='warningMsg'/>");
    pValid.text("");
    // check to see if the location entered is invalid
    // if location is invalid, then append invalid message
    // else, append a blank message
    if (isInvalid) {
      $element.find("main-area").append(pInvalid);
    } else {
      $element.find("main-area").append(pValid);
    }
  };

$scope.submit = function(city) {
  $scope.geoCodeNotSuccessful = false;  // every time when submit button is pressed, reset the geoCodeNotSuccessful to false
  $element.find("main-area").empty();   // clear out the warning messages from previous location input
  var startGeo, endGeo;

  calcRoute();

  function calcRoute() {
    // New directionsService object to interact with google maps API
    var directionsService = new google.maps.DirectionsService();
    // clear markers whenever new search
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }

    // create object to send to Google to generate directions
    var request = {
      origin: $scope.location.start,
      destination: $scope.location.end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    //send request to Google Maps Directions API with request object as data
    directionsService.route(request, function(response, status) {
      // successfully get the direction based on locations
      if (status === google.maps.DirectionsStatus.OK) {
        $scope.geoCodeNotSuccessful=false;
        // update the map on index.html
        directionsDisplay.setDirections(response);

        // if polyline from previous search, remove it
        if (!!polyline){
          polyline.setmap(null);
        }

        var polyline = new google.maps.Polyline({
          path: [],
          strokeColor: '#FF0000',
          strokeWeight: 0
        });

        var bounds = new google.maps.LatLngBounds();

        // - new google filtering - //

        // convert metric distance to miles

        distance = response.routes[0].legs[0].distance.value/1609.34;

        // determine the distance between queries
        var distanceBetweenQueries;

        if (distance <= 20) {
          distanceBetweenQueries = distance/10;
        } else if (distance <= 500) {
          distanceBetweenQueries = distance/20;
        } else if (distance <= 1500) {
          // default to yelp's max radius (25mi)
          distanceBetweenQueries = 25;
        } else {
          // optimize
          distanceBetweenQueries = 50;
        }

        /*
        * create polyline and get points at 20mi intervals
        * push to coords array, include startint latling
        */

        var coords = [];

        legs = response.routes[0].legs;
        legs.forEach(function(item) {
          steps = item.steps;
          steps.forEach(function(item) {
            path = item.path;
            path.forEach(function(item) {
              polyline.getPath().push(item);
              bounds.extend(item);
            });
          });
        });

        polyline.setMap(map);
        map.fitBounds(bounds);

        // remove first and last couple of search queries
        var intervalWaypoints = polyline.GetPointsAtDistance(distanceBetweenQueries*1609.34);
        console.log(intervalWaypoints);
        for (var i = 2; i < intervalWaypoints.length - 2; i++) {
          var x = intervalWaypoints[i];

          var obj = x.k+','+x.D;
          coords.push(obj);
        }


        // objects to be sent to backend
        var sendData = {
          distance: distance,
          optionFilter: $scope.optionFilter,
          waypoints: coords
        };

        Maps.sendPost(sendData)
        .then(function(res){
          console.log("PROMISE OBJ: ", res.data.results);
          // get back recommendations from Yelp and display as markers
          Utility.placemarkers(res.data.results);
          $scope.topTen = res.data.topTen;
          console.log(res.data.results);
        });
      } else {
        //Log the status code on error
        console.log("Geocode was not successful: " + status);
        //set the geoCodeNotSuccessful to true
        $scope.geoCodeNotSuccessful = true;
        $scope.appendWarningMsg($scope.geoCodeNotSuccessful); // append the warning message to main.html
      }
    });
  }
  };
}])

.factory('Maps', ['$http', function($http) {
// sends a POST to the server at route /csearch with all waypoints along route as data
var sendPost = function(routeObject){
  return $http.post('/search', routeObject)
    .then(function(response, error){
      // POST request successfully sent and response code was returned
      return response;
    });
  };

return {
  sendPost: sendPost
};

}]);
