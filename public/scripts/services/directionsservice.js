
angular.module('trainguideServices')
	.factory('DirectionsService', ['$http', function($http){
		var DirectionsService = {};

		var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';

		DirectionsService.getDirections = function(query, callback, err){

		}

		return DirectionsService;
	}]);