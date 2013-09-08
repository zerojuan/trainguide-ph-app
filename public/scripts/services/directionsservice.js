
angular.module('trainguideServices')
	.factory('DirectionsService', ['$http', function($http){
		var DirectionsService = {};

		var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';

		DirectionsService.getDirections = function(query, callback, err){
			var from = query.from.geometry.location;
			var to = query.to.geometry.location;

			var url = api+'/plan?fromPlace='+from.ob+','+from.pb+'&toPlace='+to.ob+','+to.pb+'&callback=JSON_CALLBACK';
			console.log(url);
			$http.jsonp(url)
			.success(function(data){
				console.log(data.plan);
			}).error(function(data, status, headers, config){
				console.log("Error accessing jsonp");
				console.log(status);
			});
		}

		return DirectionsService;
	}]);