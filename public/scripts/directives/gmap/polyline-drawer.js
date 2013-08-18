'use strict';

angular.module('google-maps')
	.directive('polylineDrawer', [function(){
		return {
			require: '^googleMap',
			restrict: 'E',
			scope: {
				paths: '=paths',
				selectedStop: '=selectedStop'
			},
			link: function(scope, elm, attrs, gmapCtrl){
				gmapCtrl.registerMapListener(scope);

				scope.onMapReady = function(map){
					scope.map = map;
				}

				var div = function(name){
					var m = document.createElement('DIV');
					m.innerHTML = '<div class="stop-marker '+name+'-marker" style="width: 20px; height: 20px;"></div>';
					return m;
				}

				var drawLines = function(){
					for(var prop in scope.paths){
						var path = scope.paths[prop];
						var decodedPath = google.maps.geometry.encoding.decodePath(path.path);

						var line = new google.maps.Polyline({
							strokeColor: path.color,
							strokeOpacity : 0.9,
							strokeWeight : 6,
							path : decodedPath
						});

						line.setMap(scope.map);

						angular.forEach(path.stops, function(stop){
							var marker = new RichMarker({
								map: scope.map,
								position: new google.maps.LatLng(stop.details.stop_lat, stop.details.stop_lon),
								anchor: RichMarkerPosition.MIDDLE,
								content: div(path.name),
								flat: true
							});

							google.maps.event.addListener(marker, 'click', function(){
								scope.selectedStop = stop;
								scope.$apply('selectedStop');
							});
						});

					}
				}

				scope.$watch('selectedStop', function(newValue){
					//center this to that stop
					if(scope.selectedStop){
						var position = new google.maps.LatLng(scope.selectedStop.details.stop_lat, scope.selectedStop.details.stop_lon);
						scope.map.setCenter(position);
					}

				});

				scope.$watch('paths', function(){
					if(scope.map && scope.paths){
						drawLines();
					}
				});

				scope.$watch('map', function(){
					if(scope.map && scope.paths){
						drawLines();
					}

				});
			}

		}
	}]);