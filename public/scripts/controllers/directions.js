
angular.module('trainguide.controllers')
	.controller('DirectionCtrl', ['$scope', 'DirectionsService', 'StopsService', function($scope, DirectionsService, StopsService){
		$scope.direction = {};
		$scope.direction.from = null;
		$scope.direction.to = null;
		$scope.getDirections = function(){
			DirectionsService.getDirections({from: $scope.direction.from, to: $scope.direction.to},
				function(data){

				},
				function(){

				});
		}
	}]);
