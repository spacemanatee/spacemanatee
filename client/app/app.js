angular.module('app', [])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {

    console.log("SCOPE ENTIRE: ", $scope.location);
    Maps.getDirections($scope.location);

  };

})

.factory('Maps', function() {

  var getDirections = function (target) {

  };

  return {
    getDirections: getDirections
  };

});
