angular.module('app', ['autofill-directive', 'ngRoute'])

.controller('mapCtrl', function($scope, Maps) {
  $scope.submit = function(city) {
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
        if (status == google.maps.DirectionsStatus.OK) {
          //Update the map on index.html
          directionsDisplay.setDirections(response);

          console.log("DIRECTIONS RESPONSE: ", response);
          console.log("LENGTH: ", response.routes[0].overview_path.length);
          console.log("OVERVIEW PATH: ", response.routes[0].overview_path);

          var sendData = {
            distance: response.routes[0].legs[0].distance.text,
            waypoints: {}
          };

          //gather all points along route returned by Google in overview_path property
          //and insert them into waypoints object to send to server
          for (var j = 0; j < response.routes[0].overview_path.length; j++) {
            sendData.waypoints[j] = response.routes[0].overview_path[j].k + "," + response.routes[0].overview_path[j].D;
          }

          console.log("sendData: ", sendData);
          // Send all waypoints along route to server
          Maps.sendPost(sendData)
          .then(function(res){
            console.log("PROMISE OBJ: ", res.data.results);
            placemarkers(res.data.results);
            // get back recommendations from Yelp and display as markers
          })

          function placemarkers (places) {
            for (var i = 0; i < places.length; i++) {
               setDelay(i, places);
            }
            // set delay for dropping each marker
            function setDelay(i, places) {
              setTimeout(function() {
                var lat = places[i].location.coordinate.latitude;
                var lng = places[i].location.coordinate.longitude;
                var description = places[i].name;
                var marker = new google.maps.Marker({
                  map: map,
                  position: new google.maps.LatLng(lat,lng),
                  animation: google.maps.Animation.DROP
                });
                attachInstructionText(marker, description);
                markerArray[i] = marker;
              }, i * 300);
            }
          }

        } else {
          //Log the status code on error
          console.log("Geocode was not successful: " + status);
        }
      });
    }

    function attachInstructionText(marker, text) {
      google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
      });
    }
  };
})

.factory('Maps', function($http) {

  var getDirections = function (target) {};

  //This function sends a POST to the server at route /csearch with all waypoints along route as data
  var sendPost = function(routeObject){

    return $http.post('/search', routeObject)
      .then(function(response, error){
        //POST request successfully sent and response code was returned
        console.log('response: ', response);
        console.log('if error: ', error);
        return response;
      })
    };

  return {
    sendPost: sendPost,
    getDirections: getDirections
  };

});
