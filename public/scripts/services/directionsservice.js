
angular.module('trainguideServices')
	.factory('DirectionsService', ['$http', function($http){
		var DirectionsService = {};

		var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';

		DirectionsService.getDirections = function(query, callback, err){

			function extractLocation(str){
				var arr = str.substring(1, str.length - 1).split(",");
				return {
					lat: parseFloat(arr[0]),
					lng: parseFloat(arr[1])
				}
			}

			function serialize(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}

			var from = extractLocation(""+query.from.geometry.location);
			var to = extractLocation(""+query.to.geometry.location);
			var d = new Date();
			var dateNow = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
			var bannedAgencies='';

			if(query.avoidBuses){
				bannedAgencies += 'LTFRB';
			}

			var query = serialize({
				bannedAgencies: bannedAgencies,
				unpreferredAgencies: 'LTFRB',
				preferredAgencies: 'LRTA,MRTC,PNR',
				date: dateNow+'&time=11:59am',
				fromPlace: from.lat+','+from.lng,
				toPlace: to.lat+','+to.lng,
				mode: 'TRANSIT,WALK'
			});

			var url = api+'/plan?'+query+'&callback=JSON_CALLBACK';
			console.log(url);
			$http.jsonp(url)
				.success(function(data){
					if(data.error){
						err(data.error);
						return;
					}
					callback(data.plan);
				}).error(function(data, status, headers, config){
					console.log('Error on API Request');
					console.log(status);
					err(status);
				});
		}

		return DirectionsService;
	}]);