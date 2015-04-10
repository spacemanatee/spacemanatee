angular.module('app', ['autofill-directive', 'ngRoute'])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {

    function codeAddress() {
      var geocoder = new google.maps.Geocoder();

    //  var addressStart = $scope.location.start;

      geocoder.geocode( { 'address': $scope.location.start}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          // map.setCenter(results[0].geometry.location);
          // var marker = new google.maps.Marker({
          //     map: map,
          //     position: results[0].geometry.location
          // });
          console.log("START LAT: ", results[0].geometry.location.k);
          console.log("START LNG: ", results[0].geometry.location.D);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });

      geocoder.geocode( { 'address': $scope.location.end}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log("END LAT: ", results[0].geometry.location.k);
          console.log("END LNG: ", results[0].geometry.location.D);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });

    }

    codeAddress();
 // Maps.sendPost({start: 'street', end: 'otherStreet'});
 //    console.log("SCOPE ENTIRE: ", $scope.location);
 //    Maps.getDirections($scope.location);

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
