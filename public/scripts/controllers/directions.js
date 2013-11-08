
angular.module('trainguide.controllers')
	.controller('DirectionCtrl', ['$scope', '$location', 'DirectionsService', 'GeocoderService', 'StopsService', function($scope, $location, DirectionsService, GeocoderService, StopsService){
		angular.extend($scope, {
			direction: {
				activeTrip: null
			},
			plan: null,
			avoidBuses: true,
			loadingQuery: false
		});

		function loadDirections(){
			var latLng = function(lat, lng){
				return new google.maps.LatLng(lat, lng);
			};

			var success = 0;

			var tripSaved = {
				flo: ($location.search()).flo,
				fla: ($location.search()).fla,
				tlo: ($location.search()).tlo,
				tla: ($location.search()).tla
			};

			console.log('PARAMETERS? ', tripSaved);

			if(tripSaved.flo && tripSaved.fla){						
				GeocoderService.geocode(latLng(tripSaved.fla, tripSaved.flo), function(data){
	      	$scope.selected.direction.from = data[0];
	      	$scope.$apply();
	      	success++;
	      	check();
				});
			}

			if(tripSaved.tlo && tripSaved.tla){
				GeocoderService.geocode(latLng(tripSaved.tla, tripSaved.tlo), function(data){
	      	$scope.selected.direction.to = data[0];
	      	$scope.$apply();
	      	success++;
	      	check();
				});
			}

			function check(){
				if(success===2) $scope.getDirections();	
			}			
		}

		$scope.getDirections = function(){
			$scope.loadingQuery = true;
			DirectionsService.getDirections({from: $scope.selected.direction.from, to: $scope.selected.direction.to, avoidBuses: $scope.avoidBuses},
				function(data){
					console.log(data);
					$scope.plan = data;
					$scope.selected.itinerary= $scope.plan.itineraries[0];
					$scope.loadingQuery = false;
					$scope.errorMessage = null;
					
					var lnglat = {
						flo: data.from.lon,
						fla: data.from.lat,
						tlo: data.to.lon,
						tla: data.to.lat
					};
					$location.search(lnglat);
				},
				function(err){
					console.log("Some error occured", err);
					$scope.loadingQuery = false;
					$scope.errorMessage = err.msg;
				});
		}

		loadDirections();

//		getRealMode: function(mode, routeId) {
//			if(mode == 'BUS') {
//				if(routeId.indexOf('PUJ') >= 0) {
//					return 'JEEP';
//				}
//				else {
//					return 'BUS';
//				}
//			}
//			else {
//				return mode;
//			}
//		}
	}]);
