
angular.module('trainguideServices')
	.factory('DirectionsService', ['$http', function($http){
		var DirectionsService = {};

		DirectionsService.getDirections = function(query, callback, err){

		}

		return DirectionsService;
	}]);