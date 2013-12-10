
angular.module('trainguide.controllers')
	.controller('MainCtrl', ['$scope', '$http', '$route', '$location',
		'LinesService', 'StopsService', 'TransfersService', 'FaresService', 'PlacesService', 'CommonAppState', 'DirectionsService', 'RoutesService',
		function($scope, $http, $route, $location,
			LinesService, StopsService, TransfersService, FaresService, PlacesService, CommonAppState, DirectionsService, RoutesService){

        console.log("This is the state params: ", ($location.search()).tlo, ($location.search()).tla);
            
				/** ================================================= **/
				/** SCOPE VARIABLES
				/** ================================================= **/
				angular.extend($scope, {
						clickedLatitudeProperty: 11,
						clickedLongitudeProperty: 44,

						showDetails: false,
						selected: {
								stop: null,
								line: null,
								dest : null,
								nearbyStops: null,
								hospital: {
										counter: 0,
										data: []
								},
								hotel: {
										counter: 0,
										data: []
								},
								office: {
										counter: 0,
										data: []
								},
								sights: {
										counter: 0,
										data: []
								},
								shops: {
										counter: 0,
										data: []
								},
								direction: {
										to: null,
										from: null
								},
								isSearch: {
										to: false,
										from: false
								},
								itinerary: null,
								leg: null
						},
						lines: null,
						menuItems: [
								{
										title: 'Line',
										selected: false
								},
								{
										title: 'Places',
										selected: false
								},
								{
										title: 'Tips',
										selected: false
								},
								{
										title: 'Download',
										selected: false
								}
						],
						selectedItem : false,
						tips : [
							{
								title : 'Ticketing',
								selected : true,
								details : [
									'The MRT and LRT use magnetic cards that are bought at ticket windows. Both single journey tickets and Stored Value Tickets (SVT) worth 100 Pesos can be bought.',
									'Simply slip the card into the turnstile slot and pass through. SVTs deduct the right amount once you exit from the station and give you a "bonus ride" which means any amount left (from .50) entitles you to one last ride.',
									'The PNR uses traditional paper tickets, bought at a ticket booth in each station.'
								],
								image : '/images/logo_card.png'
							},
							{
								title : 'Time',
								selected : false,
								details : [
									'Trains are packed during rush hour (6-8:30AM and 5:30-8PM) so schedule your trips around that time. Weekends are usually less crowded.',
									'In the large stations, ticket lines can take up to 20 minutes of your time, and security checks only make it longer. Get an SVT to skip the ticket line and save time. If SVTs aren\'t available, buy two tickets to your destination, one for going, and one for returning.',
									'PNR trains start running around 5:05, then arrive every 30 min. Arriving a little earlier than scheduled is a good idea. On Sundays the trains run every hour.'
								],
								image : '/images/logo_time.png'
							},
							{
								title : 'Safety',
								selected : false,
								details : [
									'The train system is generally safe, but petty crime can occur. Security guards man all stations and police have booths at major stations, in case of emergency or for general inquiries.',
									'The first train cars of all the train lines are reserved for women, the elderly, children and the disabled.'
								],
								image : '/images/logo_safety.png'
							},
							{
								title : 'Airport',
								selected : false,
								details : [
									'There are shuttle buses from EDSA/Taft station to the airport, but their departure times fluctuate.',
									'There are no lines to the airport as of yet, but a spur line to the airport is being explored.',
									'The nearest station to the NAIA1 and 2 is Baclaran station on LRT1. For NAIA3, the nearest station is PNR Nichols. You\'ll still need to take a taxi to the airport from these stations.'
								],
								image : '/images/logo_airport.png'
							}
						]
				});

		/** ================================================= **/
		/** WATCHERS
		/** ================================================= **/
		$scope.$watch('selected.dest', function(newValue){
			if(newValue){
				$scope.selected.direction.to = convertToGeocode(newValue.name, new google.maps.LatLng(newValue.coordinates.lat, newValue.coordinates.lng));
			}
		})
		$scope.$watch('selected.stop', function(newValue){
      if(newValue){
				$scope.menuItems[0].selected = false; //reset line sidebar
        $scope.selectedItemHandler($scope.menuItems[0]);
				//tell GA about it
				_gaq.push(['_trackEvent', newValue.details.stop_name, 'Click']);

				//check the planner if we can supply the "From" state
				if(!$scope.selected.direction.from){
					$scope.selected.direction.from = convertToGeocode(newValue.details.stop_name, new google.maps.LatLng(newValue.details.stop_lat, newValue.details.stop_lon));
				}else if(!$scope.selected.direction.to){
					$scope.selected.direction.to = convertToGeocode(newValue.details.stop_name, new google.maps.LatLng(newValue.details.stop_lat, newValue.details.stop_lon));
				}

				DirectionsService.getStopsNearPoint({from: {
					lat: $scope.selected.stop.details.stop_lat,
					lon: $scope.selected.stop.details.stop_lon
				}},
				function(data){
					// $scope.selected.nearbyStops = data;
					// var routeData = [];

					// for(var i in data){
					// 	var routes = data[i].routes;

					// 	for(var j in routes){
					// 		// console.log('routes[j]', routes[j].agencyId, routes[j].id);

					// 		RoutesService.getRouteInfo(routes[j].agencyId, routes[j].id,
					// 			function(routeInfo){
					// 				console.log(routeInfo);
					// 				routes[j].details = routeInfo;
					// 			},
					// 			function(err){
					// 				console.log('RoutesService error', err);
					// 			});
					// 	}
					// }

					$scope.selected.nearbyStops = data;
					console.log('nearby', $scope.selected.nearbyStops);
				},
				function(err){
					console.log('======== Error!');
				});
				
				reloadStopsPlaces();
			}
		});

				/** ================================================== **/
				/** SCOPE METHODS
				/** ================================================== **/
				$scope.selectedItemHandler = function(item){
						for(var i in $scope.menuItems){
								if($scope.menuItems[i].title == item.title){
										$scope.menuItems[i].selected = !$scope.menuItems[i].selected;
										if($scope.menuItems[i].selected){
												if(item.title == 'Line' && !$scope.selected.line){
														$scope.selected.line = $scope.lines.LRT1;
														$scope.showDetails = false;
														$scope.getLineDetails($scope.selected.line);
												}
												$scope.selectedItem = $scope.menuItems[i];

										}else{
												$scope.selectedItem = false;
							          $location.path('');
							          $location.search('li', null); 
										}
								}else{
										$scope.menuItems[i].selected = false;
								}
						}
						//if line is hidden, remove selected stop
						if(!$scope.menuItems[0].selected){
								$scope.selected.stop = null;
								$scope.showDetails = false;
						}
				};

				$scope.getLineByName = function(name){
						for(var i in $scope.lines){
								console.log('i', i, 'name', name);
								if(i == name){
										return $scope.lines[i];
								}
						}
						return null;
				};

				$scope.getLineDetails = function(line){
						// console.log('$scope.selected.line', line);
						$http({method: 'GET', url: '/api/details/' + line.route_id})
								.success(function(data){
										$scope.selected.line.details = data;
								})
								.error(function(data, status, headers, config){
										console.log('ERROR!!!!!!', data, status, headers, config);
								});
				};

				$scope.getPlaces = function(qry){

						PlacesService.getPlacesBySearch(qry.queryStr,
								function(data) {
										if(qry.category=='Hospital'){
												$scope.selected.hospital.totalcount = data.places.length;
										}
										if(qry.category=='Hotel'){
												$scope.selected.hotel.totalcount = data.places.length;
										}
										if(qry.category=='Office'){
												$scope.selected.office.totalcount = data.places.length;
										}
										if(qry.category=='Sightseeing'){
												$scope.selected.sights.totalcount = data.places.length;
												// console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
										}
										if(qry.category=='Shopping'){
												$scope.selected.shops.totalcount = data.places.length;
												// console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
										}
								},
								function(data, status, headers, config) {
										console.log('ERROR!!!!!!', data, status, headers, config);
								}
						);
				};

				$scope.getLimitedPlaces = function(qry){

						PlacesService.getPlacesByLimitedCategory(qry.category, qry.stopname, qry.start, qry.limit,
								function(data) {
										console.log("Get places done: ");
										console.log(data);
										if(qry.category=='Hospital'){
												$scope.selected.hospital.counter = qry.start;
												$scope.selected.hospital.data = data;
										}else if(qry.category=='Hotel'){
												$scope.selected.hotel.counter = qry.start;
												$scope.selected.hotel.data = data;
										}else if(qry.category=='Office'){
												$scope.selected.office.counter = qry.start;
												$scope.selected.office.data = data;
										}else   if(qry.category=='Sightseeing'){
												$scope.selected.sights.counter = qry.start;
												$scope.selected.sights.data = data;
										}else if(qry.category=='Shopping'){
												$scope.selected.shops.counter = qry.start;
												$scope.selected.shops.data= data;
										}
										console.log($scope.selected);
								},
								function(data, status, headers, config) {
										console.log('ERROR!!!!!!', data, status, headers, config);
								}
						);
				};

				$scope.setStop = function(resultPlace){
					$scope.selected.dest = resultPlace;
					var lineName = resultPlace.line.line_name;
					var stopId = resultPlace.stop.stop_id
					var stops = $scope.lines[lineName].stops;
					for(var i in stops){
						if(stops[i].details._id == stopId){
							$scope.selected.stop = stops[i];          
							// console.log('stops[i].details._id == stopId', stops[i].details._id, stopId);
						} 
					}
				};

				/** ================================================== **/
				/** LOCAL FUNCTIONS
				/** ================================================== **/
				function convertToGeocode(name, location){
					return {
						formatted_address: name,
						geometry: {
							location: location
						}
					};
				}

				function reloadStopsPlaces() {
						var limit = 5;
						var counter = 0;
						$scope.selected.sights.data = [];
						console.log("Getting stop name: ");
						var stopname = $scope.selected.stop.details.stop_name;
						console.log(stopname);
						$scope.getLimitedPlaces({
								limit: limit,
								start: (counter*limit),
								category: "Hospital",
								stopname: stopname
						});
						$scope.getLimitedPlaces({
								limit: limit,
								start: (counter*limit),
								category: "Hotel",
								stopname: stopname
						});
						$scope.getLimitedPlaces({
								limit: limit,
								start: (counter*limit),
								category: "Office",
								stopname: stopname
						});
						$scope.getLimitedPlaces({
								limit: limit,
								start: (counter*limit),
								category: "Shopping",
								stopname: stopname
						});
						$scope.selected.shops.data = [];
						$scope.getLimitedPlaces({
								limit: limit,
								start: (counter*limit),
								category: "Sightseeing",
								stopname: stopname
						});
				}

				function initialize() {
					LinesService.getLines(function(data, status){
							var lines = data;
							for(key in data){
									lines[key].name = key;
							}
							lines.LRT1.color = "#fdc33c";
							lines.LRT2.color = "#ad86bc";
							lines.MRT.color = "#5384c4";
							lines.PNR.color = "#f28740";
							StopsService.setLines(lines);

							var fareData = {};
							fareData.MRT = lines.MRT.fare;
							fareData.LRT1 = lines.LRT1.fare;
							fareData.LRT2 = lines.LRT2.fare;
							fareData.PNR = lines.PNR.fare;

							DirectionsService.bindFareMatrix('TRAIN', fareData);
							FaresService.getPUB(function(data){
								DirectionsService.bindFareMatrix('BUS', data);
							});
							FaresService.getPUJ(function(data){
								DirectionsService.bindFareMatrix('JEEP', data);
							});

							TransfersService.getAllTransfers(function(data){
									$scope.transfers = data;
									//iterate each transfer
									for (var i = 0; i < $scope.transfers.length; i++) {
											var fromStop = StopsService.getStopById($scope.transfers[i].from_stop_id);
											var toStop = StopsService.getStopById($scope.transfers[i].to_stop_id);
											// console.log('fromStop', fromStop, 'toStop', toStop);
											fromStop.transfer = {
													line_name : toStop.line_name,
													stop_id : toStop.details.stop_id,
													stop_name : toStop.details.stop_name,
													stop_lon : toStop.details.stop_lon,
													stop_lat : toStop.details.stop_lat
											};
									};
									$scope.lines = lines;
							}, function(data, status, headers, config){
									console.log('Error!', data, status, headers, config);
							});
					});
				}

				initialize();
		}]);
