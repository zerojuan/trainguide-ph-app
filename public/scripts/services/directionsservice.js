
angular.module('trainguideServices')
	.factory('DirectionsService', ['$http', function($http){
		var DirectionsService = {};

		var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';

		DirectionsService.getDirections = function(query, callback, err){

			function extractLocation(str){
				var arr = str.substring(1, str.length - 1).split(",");
				console.log(arr);
				return {
					lat: parseFloat(arr[0]),
					lng: parseFloat(arr[1])
				}
			}

			var from = extractLocation(""+query.from.geometry.location);
			var to = extractLocation(""+query.to.geometry.location);

			var url = api+'/plan?fromPlace='+from.lat+','+from.lng+'&toPlace='+to.lat+','+to.lng+'&callback=JSON_CALLBACK';
			$http.jsonp(url)
				.success(function(data){
					callback(data.plan);
				}).error(function(data, status, headers, config){
					console.log('Error on API Request');
					console.log(status);
					err(status);
				});
		}

		return DirectionsService;
	}]);