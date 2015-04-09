angular.module('app', [])

.controller('mapCtrl', function($scope, Maps) {

  $scope.submit = function(city) {

    if (!$scope.update) {

      document.getElementById("map-canvas-start").style.display = "none";
      // var elem = document.getElementById("map-canvas-start");
      // elem.parentNode.removeChild(elem);
      // http://red-team-design.com/removing-an-element-with-plain-javascript-remove-method/

      console.log("SCOPE LOCATION: ", $scope.city);

      Maps.getCity($scope.city);

      $scope.update = setInterval(function() {Maps.getCity($scope.city);} , 2000);

    }
  };

  $scope.stop = function() {
    clearInterval($scope.update);
    $scope.update = null;
  };

})

.factory('Maps', function() {

  var getCity = function (target) {

    // var cities = {

    //   SF: {
    //     lat: (Math.random() * (37.80 - 37.733)) + 37.733,
    //     lng: (Math.random() * (-122.387 + 122.50)) - 122.50
    //   },

    //   NY: {
    //     lat: (Math.random() * (40.7718 - 40.7074)) + 40.7074,
    //     lng: (Math.random() * (-73.9754 + 74.0011)) - 74.0011
    //   },

    //   AT: {
    //     lat: (Math.random() * (30.286 - 30.257)) + 30.257,
    //     lng: (Math.random() * (-97.7338 + 97.7625)) - 97.7625
    //   },

    //   HK: {
    //     lat: (Math.random() * (22.2847 - 22.2815)) + 22.2815,
    //     lng: (Math.random() * (114.1614 - 114.1406)) + 114.1406
    //   }

    // };

    // var city = new google.maps.LatLng(cities[target].lat, cities[target].lng);


    var randomRange = function(min, max) {
      return (Math.random() * (max - min)) + min;
    };

    var cities = {

      SF: {
        latmin: 37.733, latmax: 37.80, lngmin: -122.50, lngmax: -122.387
      },

      NY: {
        latmin: 40.7074, latmax: 40.7718, lngmin: -74.0011, lngmax: -73.9754
      },

      AT: {
        latmin: 30.257, latmax: 30.286, lngmin: -97.7625, lngmax: -97.7338
      },

      HK: {
        latmin: 22.2815, latmax: 22.2847, lngmin: 114.1406, lngmax: 114.1614
      },

      LN: {
        latmin: 51.4891, latmax: 51.5155, lngmin: -0.16454, lngmax: -0.0944
      }

    };

    var city = new google.maps.LatLng(
      randomRange(cities[target].latmin, cities[target].latmax),
      randomRange(cities[target].lngmin, cities[target].lngmax)

    );

    var mapOptions = {
        center: city,
        zoom: 14
    };

    var map = new google.maps.Map(
      document.getElementById('map-canvas'), mapOptions);

    var panoramaOptions = {
      position: city,
      pov: {
        heading: Math.floor(Math.random() * 360),
        pitch: Math.floor(Math.random() * 12)
      }
    };

    console.log("HEADING: ", panoramaOptions.pov.heading);
    console.log("PITCH: ", panoramaOptions.pov.pitch);

    var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

    map.setStreetView(panorama);

    console.log("PANORAMA: ", panorama);
    console.log("MAP: ", map);
    console.log("MAP CENTER: ", map.center);

  }

  return {
    getCity: getCity
  };

});
