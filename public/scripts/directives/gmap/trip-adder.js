
angular.module('google-maps')
	.directive('tripAdder', ['PlacesService', 'GeocoderService', function(PlacesService, GeocoderService){
		return {
			require: '^googleMap',
			restrict: 'E',
			scope: {
				isSearch: '=',
				direction: '='
			},
			link: function(scope, elm, attrs, gmapCtrl){
				gmapCtrl.registerMapListener(scope);

				var geocoder = new google.maps.Geocoder();
				var fromMarker = null;
				var toMarker = null;

				scope.onMapReady = function(map){
					scope.map = map;
					google.maps.event.addListener(scope.map, 'click', onClickMap);
				}

				function onClickMap(event){
					var clickPos = event.latLng;
					console.log('event', event);
					if(scope.isSearch.to ||
						scope.isSearch.from){
						// geocoder.geocode({'latLng': clickPos}, function(results, status){
						// 	if(status == google.maps.GeocoderStatus.OK){
						// 		console.log(results);
						// 		results[0].geometry.location = clickPos;
						// 		setPlace(results[0]);
						// 	}else{
						// 		console.log("Geocoder failed: " + status);
						// 	}
						// });
						GeocoderService.geocode(clickPos, function(data){
							setPlace(data[0]);
						});
					}
				}

				function setPlace(value){
					if(scope.isSearch.to){
						scope.direction.to = value;

						scope.$apply();
					}else if(scope.isSearch.from){
						scope.direction.from = value;
						scope.$apply();
					}
				}

				function showHideCursor(){
					if(scope.isSearch.to){
						scope.map.setOptions({draggableCursor: 'url(images/marker_end.png) 16 16, default'});
					}else if(scope.isSearch.from){
						scope.map.setOptions({draggableCursor: 'url(images/marker_start.png) 16 16, default'});
					}else{
						scope.map.setOptions({draggableCursor: null});
					}
				}

				scope.$watch('isSearch.to', function(){
					showHideCursor();
				});

				scope.$watch('isSearch.from', function(){
					showHideCursor();
				});

				scope.$watch('direction.to', function(newValue){
					if(!newValue){
						if(fromMarker)
							fromMarker.setMap(null);
						return;
					}
					if(fromMarker){
						fromMarker.setMap(null)
					}
					scope.isSearch.to = false;
					fromMarker = new google.maps.Marker({
						position: newValue.geometry.location,
						map: scope.map,
						icon: 'images/marker_end.png',
						zIndex: 9000,
						animation: google.maps.Animation.DROP
					});
				});

				scope.$watch('direction.from', function(newValue){
					if(!newValue){
						if(toMarker)
							toMarker.setMap(null);
						return;
					}
					if(toMarker){
						toMarker.setMap(null)
					}
					scope.isSearch.from = false;
					toMarker = new google.maps.Marker({
						position: newValue.geometry.location,
						map: scope.map,
						icon: 'images/marker_start.png',
						zIndex: 9000,
						animation: google.maps.Animation.DROP
					});
				});
			}
		}
	}]);