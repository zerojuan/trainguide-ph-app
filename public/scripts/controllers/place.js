angular.module('trainguide.controllers')
  .controller('PlaceCtrl', ['$scope', '$http', function($scope, $http){
    $scope.getPlaces = function(qry){
      
      $http.get('/places/search-place', qry)
        .success(function(data, status) {
          scope.hospitals = JSON.stringify(data);
        })
        .error(function(data, status, headers, config) {
          console.log('ERROR!!!!!!', data, status, headers, config);
        }); 
    }
  }]);