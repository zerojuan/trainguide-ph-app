'use strict';

angular.module('google-maps')
	.directive('polylineDrawer', ['$location', function($location){
		return {
			require: '^googleMap',
			restrict: 'E',
			scope: {
				paths: '=paths',
				selectedStop: '=selectedStop',
				selectedLine : '=selectedLine',
				showDetails: '=showDetails',
				selectedItem: '=selectedItem'
			},
			link: function(scope, elm, attrs, gmapCtrl){
				gmapCtrl.registerMapListener(scope);

				scope.onMapReady = function(map){
					scope.map = map;
				}

				var setLine = function(){
					for(var line in scope.paths){
						if(scope.selectedStop.details.stop_name.indexOf(line) != -1){
							scope.selectedLine = scope.paths[line];
						}else{
							for(var lineStop in scope.paths[line].stops){
								if(scope.selectedStop.details.stop_name.indexOf(scope.paths[line].stops[lineStop].details.stop_name) != -1){
									scope.selectedLine = scope.paths[line];
									break;
								}
							}
						}
					}
				}

				var getIcon = function(name){
					var icon = {
						anchor: new google.maps.Point(11, 11),
						url: "images/marker-"+name+".png"
					}
					return icon;
				}

				var drawLines = function(){
					for(var prop in scope.paths){
						var path = scope.paths[prop];
						var decodedPath = google.maps.geometry.encoding.decodePath(path.path);

						var line = new google.maps.Polyline({
							strokeColor: path.color,
							strokeOpacity : 0.9,
							strokeWeight : 6,
							path : decodedPath,
							zIndex: 5
						});

						line.setMap(scope.map);

						angular.forEach(path.stops, function(stop){
							var marker = new google.maps.Marker({
								map: scope.map,
								position: new google.maps.LatLng(stop.details.stop_lat, stop.details.stop_lon),
								icon: getIcon(path.name),
								zIndex: 0
							});


							var infoWindow = createInfoWindow(stop.details.stop_name);
							google.maps.event.addListener(marker, 'click', function(){
								scope.selectedStop = stop;
								infoWindow.open(scope.map, marker);
								setLine();
								scope.$apply('selectedStop');
							});
						});

					}
				}

				function createInfoWindow(name){
					//console.log('Creating new info window: ' + name);
					return new InfoBox({
						content : '<div class="infobox"><span>'+name+'</span></div><img style="position: fixed; margin-left: 40px; margin-top:-1px;" src="images/bottom-arrow.png"></img>',
						boxStyle :{
							opacity : 1
						},
						closeBoxURL : "/images/close.png",
						maxWidth : 100,
						pane: "floatPane",
						pixelOffset: new google.maps.Size(-50, -60),
						infoBoxClearance: new google.maps.Size(2,2)
					});
				}

				scope.$watch('selectedStop', function(newValue){
					//center this to that stop
					if(scope.selectedStop){			
						scope.showDetails = true;

						var position = new google.maps.LatLng(scope.selectedStop.details.stop_lat, scope.selectedStop.details.stop_lon);
						scope.map.setCenter(position);
						scope.map.setZoom(16);

						setLine();
						$location.search({li: scope.selectedLine.name, st: scope.selectedStop.stop_id});
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