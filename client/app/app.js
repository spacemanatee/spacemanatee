angular.module('app', [])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {

      console.log("SCOPE LOCATION: ", $scope.city);

      Maps.getCity($scope.city);

    }
  };

})

.factory('Maps', function() {

  var getDirections = function (target) {

  };

  return {
    getDirections: getDirections
  };

});
