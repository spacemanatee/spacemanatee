angular.module('app', ['autofill-directive', 'ngRoute'])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {

    console.log("SCOPE ENTIRE: ", $scope.location);
    var startGeo, endGeo;

    // function codeAddress() {
    //   var geocoder = new google.maps.Geocoder();

    //   geocoder.geocode( { 'address': $scope.location.start}, function(results, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //       map.setCenter(results[0].geometry.location);
    //       var marker = new google.maps.Marker({
    //           map: map,
    //           position: results[0].geometry.location,
    //           animation: google.maps.Animation.DROP
    //       });

    //       console.log("RESULTS: ", results, results[0].geometry.location)
    //       startGeo = results[0].geometry.location.k + "," + results[0].geometry.location.D;

    //       geocoder.geocode( { 'address': $scope.location.end}, function(results, status) {
    //         if (status == google.maps.GeocoderStatus.OK) {

    //           var marker = new google.maps.Marker({
    //               map: map,
    //               position: results[0].geometry.location,
    //               animation: google.maps.Animation.DROP
    //           });

    //           endGeo = results[0].geometry.location.k + "," + results[0].geometry.location.D;

    //         } else {
    //           console.log("Geocode was not successful: " + status);
    //         }

    //       });

    //     } else {
    //       console.log("Geocode was not successful: " + status);
    //     }
    //   });

    // }

    // codeAddress();

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

          console.log("DIRECTIONS RESPONSE: ", response);
          console.log("LENGTH: ", response.routes[0].overview_path.length);
          console.log(response.routes[0].overview_path);

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

          console.log("WAYPOINTS: ", waypoints);
          Maps.sendPost(waypoints);

        } else {
          console.log("Geocode was not successful: " + status);
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
