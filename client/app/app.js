angular.module('app', ['autofill-directive', 'ngRoute'])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {

    console.log("SCOPE ENTIRE: ", $scope.location);
    var startGeo, endGeo;

    function codeAddress() {
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode( { 'address': $scope.location.start}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              animation: google.maps.Animation.DROP
          });
          console.log("RESULTS: ", results, results[0].geometry.location)
          startGeo = results[0].geometry.location.k + "," + results[0].geometry.location.D;
        } else {
          console.log("Geocode was not successful: " + status);
        }
      });

      geocoder.geocode( { 'address': $scope.location.end}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              animation: google.maps.Animation.DROP
          });

          endGeo = results[0].geometry.location.k + "," + results[0].geometry.location.D;

        var locations = {
          start: startGeo,
          end: endGeo
        };

        console.log("LOCATIONS: ", locations);
        Maps.sendPost(locations);

        } else {
          console.log("Geocode was not successful: " + status);
        }
      });

    }

    codeAddress();

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
