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

  $scope.optionFilter = $scope.optionSelections[1].value;
  $scope.geoCodeNotSuccessful=false;

  $scope.append = function(isInvalid) {
    var pInvalid = angular.element("<p id='warningMsg'/>");
    pInvalid.text("Please choose a continental location and resubmit");
    var pValid = angular.element("<p id='warningMsg'/>");
    pValid.text("");
    if (isInvalid) {
      $element.find("main-area").append(pInvalid);
    } else {
      $element.find("main-area").append(pValid);
    }
  }

  $scope.submit = function(city) {
    $scope.geoCodeNotSuccessful=false;
    $element.find("main-area").empty();
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
          $scope.geoCodeNotSuccessful=false;
          //Update the map on index.html
          directionsDisplay.setDirections(response);

          console.log("DIRECTIONS RESPONSE: ", response);
          console.log("LENGTH: ", response.routes[0].overview_path.length);
          console.log("OVERVIEW PATH: ", response.routes[0].overview_path);

          var sendData = {
            distance: response.routes[0].legs[0].distance.text,
            optionFilter: $scope.optionFilter,
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
            // get back recommendations from Yelp and display as markers
            Utility.placemarkers(res.data.results);
            $scope.topTen = res.data.topTen;
            console.log(res.data.results);
          });
        } else {
          //Log the status code on error
          console.log("Geocode was not successful: " + status);
          $scope.geoCodeNotSuccessful=true;
          $scope.append($scope.geoCodeNotSuccessful);
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
      })
    };

  return {
    sendPost: sendPost
  };

}]);
