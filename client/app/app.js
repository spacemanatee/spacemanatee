angular.module('app', ['autofill-directive', 'ngRoute'])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {


// Maps.sendPost({start: 'street', end: 'otherStreet'});
    console.log("SCOPE ENTIRE: ", $scope.location);
    Maps.getDirections($scope.location);

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
