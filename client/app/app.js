angular.module('app', ['autofill-directive', 'ngRoute'])

.controller('mapCtrl', function($scope, Maps) {
  $scope.submit = function(city) {
    console.log("SCOPE ENTIRE: ", $scope.location);
    var startGeo, endGeo;

    calcRoute();

    function calcRoute() {
      //New directionsService object to interact with google maps API
      var directionsService = new google.maps.DirectionsService();

      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }

      var request = {
        //origin and destination are obtained from form on index.html
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
          console.log(response.routes[0].overview_path);

          //create random markers to place on map for mockup

          function placemarkers () {
            for (var i = 0; i < 20; i++) {
              setDelay(i);
            }

            function setDelay(i) {
              setTimeout(function() {
                var random = Math.floor(Math.random() * response.routes[0].overview_path.length);
                var marker = new google.maps.Marker({
                   map: map,
                   title: "Hello World!",
                   position: response.routes[0].overview_path[random],
                   animation: google.maps.Animation.DROP
                });
                attachInstructionText(marker, 'hello, world');
                markerArray[i] = marker;
              }, i * 300);
            }

            var waypoints = {};
            //gather all points along route returned by Google in overview_path property
            //and insert them into waypoints object to send to server
            for (var j = 0; j < response.routes[0].overview_path.length; j++) {
              waypoints[j] = response.routes[0].overview_path[j].k + "," + response.routes[0].overview_path[j].D;
            }

            console.log("WAYPOINTS: ", waypoints);
            //Send all waypoints along route to server
            Maps.sendPost(waypoints);
          }

          placemarkers();

        } else {
          //Log the status code on error
          console.log("Geocode was not successful: " + status);
        }
      });
    }

    function attachInstructionText(marker, text) {
      google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on,
        // containing the text of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
      });
    }
  };
})
.factory('Maps', function($http) {

  var getDirections = function (target) {};

  //This function sends a POST to the server at route /search with all waypoints along route as data
  var sendPost = function(routeObject){

    $http.post('/search', routeObject)
      .then(function(response, error){
        //POST request successfully sent and response code was returned
        console.log('response: ', response);
        console.log('error: ', error);
        return response;
      })
    };

  return {
    sendPost: sendPost,
    getDirections: getDirections
  };

});
