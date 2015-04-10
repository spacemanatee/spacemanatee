angular.module('app', [])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {

      //console.log("SCOPE LOCATION: ", $scope.city);

      //Maps.getCity($scope.city);

      Maps.sendPost({start: 'street', end: 'otherStreet'});
    }


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
