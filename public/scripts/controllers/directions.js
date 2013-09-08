
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

				},
				function(){

				});
		}
	}]);
