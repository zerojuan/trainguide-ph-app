angular.module('trainguideServices')
	.factory('PlacesService', ['$http', function($http){
			var PlacesService = {};
	    PlacesService.categories = [
	      {
	        name : 'Dining'
	      },
	      {
	        name : 'Entertainment'
	      },
	      {
	        name : 'Government Building'
	      },
	      {
	        name : 'Hospital', 
	        icon : 'icon-hospital'
	      },
	      {
	        name : 'Hotel', 
	        icon : 'icon-hotel'
	      },
	      {
	        name : 'Office', 
	        icon : 'icon-office'
	      },
	      {
	        name : 'Religion', 
	      },
	      {
	        name : 'Residential', 
	      },
	      {
	        name : 'School', 
	      },
	      {
	        name : 'Service', 
	      },
	      {
	        name : 'Shopping', 
	        icon : 'icon-shopping'
	      },
	      {
	        name : 'Sightseeing', 
	        icon : 'icon-sights'
	      },
	      {
	        name : 'Sports', 
	      },
	      {
	        name : 'Transport Terminal'
	      }
	    ];

	    PlacesService.activeCategories = function(){
	      var result = [];
	      for(var i in PlacesService.categories){
	        if(PlacesService.categories[i].icon)
	          result.push(PlacesService.categories[i]);
	      }
	      return result;
	    }

			PlacesService.getPlacesBySearch = function(category, query, callback, err){
				$http({method: 'GET', url: '/places/search-place/?category='+category+'&queryStr='+query+'&format=json'})
					.success(function(data, status) {
						callback(data, status);
					})
					.error(function(data, status, headers, config) {
						err(data, status, headers, config);
					});
			}

			PlacesService.getPlacesByLimitedCategory = function(category, stopname, start, limit, callback, err){
				$http({method: 'GET', url: '/places/paginate-place/?category='+category+'&stopname='+stopname+'&start='+start+'&limit='+limit})
					.success(function(data, status) {
						callback(data, status);
					})
					.error(function(data, status, headers, config) {
						err(data, status, headers, config);
					});
			}

			return PlacesService;
	}]);