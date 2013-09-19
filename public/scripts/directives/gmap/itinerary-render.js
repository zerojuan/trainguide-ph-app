
angular.module('google-maps')
	.directive('itineraryRender', ['$rootScope', function($rootScope){
		return {
			require: '^googleMap',
			restrict: 'E',
			scope: {
				itinerary: '='
			},
			link: function(scope, elm, attrs, ctrl){
				ctrl.registerMapListener(scope);

				var paths = [];

				scope.onMapReady = function(map){
					scope.map = map;
				};

				scope.$watch('map', function(){

				});

				function zoomToObject(arr){
					var bounds = new google.maps.LatLngBounds();
					for(var i in arr){
						var obj = arr[i];
						var points = obj.getPath().getArray();
						for (var n = 0; n < points.length ; n++){
							bounds.extend(points[n]);
						}
					}

					scope.map.fitBounds(bounds);
				}

				var drawLines = function(){
					angular.forEach(paths, function(v, i){
						v.setMap(null);
					});
					paths = [];
					for(var legs in scope.itinerary.legs){
						var leg = scope.itinerary.legs[legs];
						var decodedPath = google.maps.geometry.encoding.decodePath(leg.legGeometry.points);

						var color = '#2BA6CB';
						var lineSymbol = {
							path: 'M 0,-1 0,1',
							strokeOpacity: 1,
							scale: 2
						};

						var path = null;
						if(leg.mode == 'WALK'){
							path = new google.maps.Polyline({
								strokeColor: color,
								path: decodedPath,
								strokeOpacity: 0,
								icons: [{
									icon: lineSymbol,
									offset: '0',
									repeat: '10px'
								}],
								map: scope.map,
								zIndex: 10
							});
						}else{
							path = new google.maps.Polyline({
								strokeColor: color,
								strokeOpacity : 0.9,
								strokeWeight : 5,
								path : decodedPath,
								zIndex: 10,
								map: scope.map
							});
						}

						paths.push(path);
					}
					zoomToObject(paths);
				}

				scope.$watch('itinerary', function(newValue, oldValue){
					if(newValue){
						console.log('Itenerary changed: ', scope.itinerary);
						drawLines();	
					}
				});
			},
			replace: true,
			template: '<div></div>'
		}
	}]);