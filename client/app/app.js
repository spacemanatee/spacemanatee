angular.module('app', ['autofill-directive', 'ngRoute'])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {
    var startGeo, endGeo;

    calcRoute();

    function calcRoute() {

      var directionsService = new google.maps.DirectionsService();

      var request = {
          origin: $scope.location.start,
          destination: $scope.location.end,
          travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);

          for (var i = 0; i < 20; i++) {
            var random = Math.floor(Math.random() * response.routes[0].overview_path.length);

            var marker = new google.maps.Marker({
               map: map,
               position: response.routes[0].overview_path[random],
               animation: google.maps.Animation.DROP
            });
          }

          var waypoints = {};

          for (var j = 0; j < response.routes[0].overview_path.length; j++) {
            waypoints[j] = response.routes[0].overview_path[j].k + "," + response.routes[0].overview_path[j].D;
          }

          Maps.sendPost(waypoints);

        } else {
          return "Geocode was not successful: " + status;
        }
      });
    }
  };

})

.factory('Maps', function($http) {

  var getDirections = function (target) {
  };

  var sendPost = function(routeObject){
    $http.post('/search', routeObject)
      .then(function(response, error){
        return response;
      })
    };

  return {
    sendPost: sendPost,
    getDirections: getDirections
  };

});
