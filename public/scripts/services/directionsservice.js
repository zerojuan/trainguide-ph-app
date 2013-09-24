
angular.module('trainguideServices')
	.factory('DirectionsService', ['$http', function($http){
		var DirectionsService = {};

		var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';

		function serialize(obj) {
			var str = [];
			for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			return str.join("&");
		}

		DirectionsService.getStopsNearPoint = function(query, callback, err){
			var query = serialize({
				lat: query.from.lat,
				lon: query.from.lon
			});

			var url = api+'/transit/stopsNearPoint?'+query+'&callback=JSON_CALLBACK';
			$http.jsonp(url)
				.success(function(data){
					if(data.error){
						err(data.error);
						return;
					}
					console.log("Stops Near Point:");
					console.log(data);
					var stops = [];
					//only return stops that aren't rail
					for(var i in data.stops){
						var stop = data.stops[i];
						if(stop.stopName.indexOf('PNR') == -1 &&
							stop.stopName.indexOf('LRT') == -1 &&
							stop.stopName.indexOf('MRT') == -1){
							stops.push(stop);
						}
					}
					callback(stops);
				}).error(function(data, status, headers, config){
					console.log('Error on API Request');
					console.log(status);
					err(status);
				});
		}

		DirectionsService.getDirections = function(query, callback, err){
			if(!query.from || !query.to){
				err({
					msg: 'Missing path information'
				});
				return;
			}


			function extractLocation(str){
				var arr = str.substring(1, str.length - 1).split(",");
				return {
					lat: parseFloat(arr[0]),
					lng: parseFloat(arr[1])
				}
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