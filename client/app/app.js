angular.module('app', ['autofill-directive', 'ngRoute', 'app.service'])

.controller('mapCtrl', ['$scope', '$element', 'Maps', 'Utility', function($scope, $element, Maps, Utility) {
  //initialize the user input option selector
  $scope.optionSelections = [
    {name: 'Everything', value:""},
    {name: 'Food', value:"food"},
    {name: 'NightLife', value:"nightlife"},
    {name: 'Shopping', value:"shopping"},
    {name: 'Medical', value:"medical"},
    {name: 'Gas', value:"gas"},
    {name: 'Pets', value:"pets"}
  ];
  //set default option filter to "food"
  $scope.optionFilter = $scope.optionSelections[1].value;
  //initialize the geoCodeNotSuccessful to be used for determining valid continental destination or not
  $scope.geoCodeNotSuccessful = false;

  $scope.appendWarningMsg = function(isInvalid) {
    // invalid message template
    var pInvalid = angular.element("<p id='warningMsg'/>");
    pInvalid.text("Please choose a continental location and resubmit");
    // valid message template
    var pValid = angular.element("<p id='warningMsg'/>");
    pValid.text("");
    //check to see if the location entered is invalid
    //if location is invalid, then append invalid message
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
    console.log("SCOPE ENTIRE: ", $scope.location);
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
          //Update the map on index.html
          directionsDisplay.setDirections(response);


          // - new google filtering - //

          // convert metric distance to miles

          distance = response.routes[0].legs[0].distance.value/1609.34;

          // determine the distance between queries
          var distanceBetweenQueries;

          if (distance <= 20) {
            distanceBetweenQueries = distance/10;
          } else if (distance <= 500) {
            distanceBetweenQueries = distance/20;
          } else {
            // default to yelp's max radius (25mi)
            distanceBetweenQueries = 25;
          }

          /*
          * create polyfill line and get points at 20mi intervals
          * push to coords array, include startint latling
          */

          var coords = []

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

          (polyline.GetPointsAtDistance(distanceBetweenQueries*1609.34)).forEach(function(x){

            var obj = {
              location: {
                coordinate : {
                  latitude: x.k,
                  longitude: x.D
                }
              }
            };
            coords.push(obj);
          });

          // push the starting position

          coords.push({
              location: {
                coordinate : {
                  latitude: response.routes[0].legs[0].start_location.k,
                  longitude: response.routes[0].legs[0].start_location.D
                }
              }
            });

          //   var obj = [x.k, x.D];
          //   coords.push(obj);
          // });

          // // push the starting position

          // coords.push([response.routes[0].legs[0].start_location.k,
          //         response.routes[0].legs[0].start_location.D]);




          console.log("DIRECTIONS RESPONSE: ", response);

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
  //This function sends a POST to the server at route /csearch with all waypoints along route as data
  var sendPost = function(routeObject){
    return $http.post('/search', routeObject)
      .then(function(response, error){
        //POST request successfully sent and response code was returned
        console.log('response: ', response);
        console.log('error: ', error);
        return response;
      });
    };

  return {
    sendPost: sendPost
  };

}]);
