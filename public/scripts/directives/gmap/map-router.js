'use strict';

angular.module('google-maps')
	.factory('MapDirectionsService', function(){
		var directionService = {};

		var directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: false
		});
		var _directionsService = new google.maps.DirectionsService();

//		directionsDisplay.suppressMarkers = true;

		directionService.setMap = function setMap(map){
			directionsDisplay.setMap(map);
		}

		directionService.calcRoute = function calcRoute(start, end, callback){
			var request = {
				origin: start,
				destination: end,
				travelMode: google.maps.DirectionsTravelMode.WALKING
			};

			_directionsService.route(request, function(response, status){
				if(status == google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(response);
				}
			});
		};

		return directionService;
	})
	.directive('mapRouter', ['MapDirectionsService', function(DirectionsService){
		return {
			require: '^googleMap',
			restrict: 'E',
			scope: {
				selectedStop: '=selectedStop',
				selectedDest: '=selectedDest'
			},
			link: function(scope, elm, attrs, ctrl){
				ctrl.registerMapListener(scope);

				scope.onMapReady = function(map){
					console.log("Map is here!", map);
					scope.map = map;
				};

				scope.$watch('map', function(){
					DirectionsService.setMap(scope.map);
				});

				scope.$watch('selectedDest', function(){
					console.log('scope.selectedStop && scope.selectedDest!!!', scope.selectedStop, scope.selectedDest);
					if(scope.selectedStop && scope.selectedDest){
						var start = new google.maps.LatLng(scope.selectedStop.details.stop_lat, scope.selectedStop.details.stop_lon);
						var end = new google.maps.LatLng(scope.selectedDest.coordinates.lat, scope.selectedDest.coordinates.lng);	

						DirectionsService.calcRoute(start, end);
					}
				});
			},
			replace: true,
			template: '<div></div>'
		}
	}]);