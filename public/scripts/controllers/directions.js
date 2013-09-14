
angular.module('trainguide.controllers')
	.controller('DirectionCtrl', ['$scope', 'DirectionsService', 'StopsService', function($scope, DirectionsService, StopsService){
		angular.extend($scope, {
			direction: {
				from: null,
				to: null
			}
		});

		$scope.getDirections = function(){
			DirectionsService.getDirections({from: $scope.direction.from, to: $scope.direction.to},
				function(data){
//					data.itineraries []
//						- legs []
//							- leg.from.name
//							- leg.to.name
//							- leg.legGeometry
//							- leg.mode
//					 		- leg.steps
				},
				function(){

				});
		}
	}]);
