
angular.module('trainguideServices')
	.factory('DirectionsService', ['$http', '$filter', function($http, $filter){
		var DirectionsService = {};

		var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';

		var fareMatrix = {};

		function serialize(obj) {
			var str = [];
			for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			return str.join("&");
		}

		DirectionsService.bindFareMatrix = function(type, data){
			switch(type){
				case 'TRAIN': fareMatrix.train = data;							  
							  break;
				case 'BUS':   fareMatrix.bus = data;
							  break;
				case 'JEEP':  fareMatrix.jeep = data; 
			}
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

					function calculateFare(trip){
						//loop through each leg
						var totalFare = 0;
						angular.forEach(trip.legs, function(leg){

							var realMode = $filter('realmode')(leg.mode, leg.routeId),
								distance = Math.round(leg.distance/1000),
								foundFare = 0;
							var getStationDistance = function(startIndex, endIndex){
								return Math.abs(startIndex - endIndex);
							}
							var getFareFromMatrix = function(distance, fareMatrix){
								var fare = (distance >= fareMatrix.length) ?
											fareMatrix[fareMatrix.length-1] :
											fareMatrix[distance];
								if(fare instanceof Array && fare.length > 1){
									return fare[0];
								}
								return fare;
							}
							switch(realMode){
								case 'RAIL':
											distance = getStationDistance(leg.from.stopIndex, leg.to.stopIndex);
											//get routeshortname
											switch(leg.routeShortName){
												case 'LRT 1':
													foundFare = getFareFromMatrix(distance, fareMatrix.train.LRT1);
													break;
												case 'LRT 2':
													foundFare = getFareFromMatrix(distance, fareMatrix.train.LRT2);
													break;
												case 'MRT-3':
													foundFare = getFareFromMatrix(distance, fareMatrix.train.MRT);
													break;
												case 'PNR MC':
													distance = Math.round(leg.distance/1000);
													for(var i = 0; i < fareMatrix.train.PNR.length; i++){
														var zoneDist = fareMatrix.train.PNR[i][1];
														if(distance < zoneDist){
															foundFare = fareMatrix.train.PNR[i][0];
															break;
														}
													}
													break;
											}
											break;
								case 'JEEP':
											foundFare = getFareFromMatrix(distance, fareMatrix.jeep.matrix);	
											break; 
								case 'BUS' : 
											foundFare = getFareFromMatrix(distance, fareMatrix.bus.matrix);
											break;
							}	
							leg.fare = foundFare;
							totalFare += leg.fare;
						});
						return totalFare;
					}

					function isSameTrip(tripA, tripB){
						//is the same
						if($filter('tominutes')(tripA.duration) != $filter('tominutes')(tripB.duration) ){
							return false;
						}

						for(var k = 0; k < tripA.legs.length; k++){
							if(!tripB.legs[k]){
								return false;
							}
							if(tripA.legs[k].from.name != tripB.legs[k].from.name){
								return false;
							}
						}
						return true;
					}

					console.log("===============");
					//fix duration
					angular.forEach(data.plan.itineraries, function(trip){
						var duration = 0;
						angular.forEach(trip.legs, function(leg){
							duration += leg.duration;
						});
						trip.duration = duration;
					});
					//if same legs.from.name don't add it
					var itineraries = [];
					for(var i = data.plan.itineraries.length-1; i >= 0; i--){
						var tripA = data.plan.itineraries[i];
						var tripB;
						var match = false;
						for(var j = i - 1; j >= 0; j--){
							tripB = data.plan.itineraries[j];
							match = isSameTrip(tripA, tripB);
						}
						if(!match){
							itineraries.push(tripA);
						}
					}

					//loop through itineraries
					for(var i in itineraries){
						itineraries[i].fare = calculateFare(itineraries[i]);
					}
						
						
					
					data.plan.itineraries = itineraries;
					console.log(data.plan);
					callback(data.plan);
				}).error(function(data, status, headers, config){
					console.log('Error on API Request');
					console.log(status);
					err(status);
				});
		}

		return DirectionsService;
	}]);