angular.module('trainguideServices')
	.factory('PlacesService', ['$http', function($http){
			var PlacesService = {};

			PlacesService.getPlacesByCategory = function(category, callback, err){
				$http({method: 'GET', url: '/places/search-place/?queryStr='+category+'&format=json'})
					.success(function(data, status) {
						callback(data, status);
					})
					.error(function(data, status, headers, config) {
						err(data, status, headers, config);
					});
			}

			PlacesService.getPlacesByLimitedCategory = function(category, start, limit, callback, err){
				$http({method: 'GET', url: '/places/paginate-place/?category='+category+'&start='+start+'&limit='+limit})
					.success(function(data, status) {
						callback(data, status);
					})
					.error(function(data, status, headers, config) {
						err(data, status, headers, config);
					});
			}

			return PlacesService;
	}]);