angular.module('trainguide.controllers')
  .controller('PlaceCtrl', ['$scope', '$http', 'PlacesService', function($scope, $http, PlacesService){
		$scope.places = [];

    $scope.getPlaces = function(qry){

			PlacesService.getPlacesByCategory(qry.queryStr,
				function(data) {
					$scope.places = data.places;
				}
				,
				function(data, status, headers, config) {
					console.log('ERROR!!!!!!', data, status, headers, config);
				}
			);
    };
  }]);