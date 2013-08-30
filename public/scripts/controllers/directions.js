
angular.module('trainguide.controllers')
	.controller('DirectionCtrl', ['$scope', 'DirectionsService', function($scope, DirectionsService){
		$scope.getDirections = function(){
			DirectionsService.getDirections({from: 'test', to: 'test'},
				function(data){

				},
				function(){

				});
		}
	}]);
