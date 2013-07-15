/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

(function () {

	"use strict";

	/*
	 * Utility functions
	 */

	/**
	 * Check if 2 floating point numbers are equal
	 *
	 * @see http://stackoverflow.com/a/588014
	 */
	function floatEqual (f1, f2) {
		return (Math.abs(f1 - f2) < 0.000001);
	}

	/*
	 * Create the model in a self-contained class where map-specific logic is
	 * done. This model will be used in the directive.
	 */

	var MapModel = (function () {
		var _defaults = {
			zoom: 8,
			draggable: false,
			container: null
		};

		/**
		 *
		 */
		function PrivateMapModel(opts) {

			var _instance = null,
				_markers = [],  // caches the instances of google.maps.Marker
				_handlers = [], // event handlers
				_windows = [],  // InfoWindow objects
				o = angular.extend({}, _defaults, opts),
				that = this;
			console.log(opts);
			this.center = opts.center;
			this.zoom = o.zoom;
			this.draggable = o.draggable;
			this.dragging = false;
			this.selector = o.container;
			this.markers = [];
			this.paths = [];
			this.stopMarkers = [];

			this.clickHandler = function(){
				console.log("Clicked Me Instead");
			}

			this.draw = function () {

				if (that.center == null) {
					// TODO log error
					console.log('ERROR: NO CENTER');
					return;
				}

				if (_instance == null) {

					// Create a new map instance
					var mapStyle = [
						{
							featureType:"road",
							elementType:"geometry",
							stylers:[{hue:"#8800ff"},{lightness:100}]
						},{
							featureType: "transit.station",
							stylers: [
								{ visibility: "off" }
							]
						},{
							featureType: "transit.station.rail",
							stylers: [
								{ visibility: "on" }
							]
						},{
							featureType: "transit.station",
							elementType: "labels",
							stylers: [
								{ visibility: "off" }
							]
						},{
							featureType:"road",
							stylers:[{visibility:"on"},{hue:"#91ff00"},{saturation:-62},{gamma:1.98},{lightness:45}]
						},{
							featureType:"water",
							stylers:[{hue:"#005eff"},{gamma:.72},{lightness:42}]
						},{
							featureType:"transit.line",
							stylers:[{visibility:"off"}]
						},{
							featureType:"administrative.locality",
							stylers:[{visibility:"on"}]
						},{
							featureType:"administrative.neighborhood",
							elementType:"geometry",
							stylers:[{visibility:"simplified"}]
						},{
							featureType:"landscape",
							stylers:[{visibility:"on"},{gamma:.41},{lightness:46}]
						},{
							featureType:"administrative.neighborhood",
							elementType:"labels.text",
							stylers:[{visibility:"off"},{saturation:33},{lightness:20}]
						}];


					_instance = new google.maps.Map(that.selector, {
						center: that.center,
						zoom: that.zoom,
						draggable: that.draggable,
						mapTypeId : google.maps.MapTypeId.ROADMAP,
						styles: mapStyle,
						zoomControl : true,
						zoomControlOptions : {
							style : google.maps.ZoomControlStyle.SMALL
						},
						disableDefaultUI : true
					});

					google.maps.event.addListener(_instance, "dragstart",

						function () {
							that.dragging = true;
						}
					);

					google.maps.event.addListener(_instance, "idle",

						function () {
							that.dragging = false;
						}
					);

					google.maps.event.addListener(_instance, "drag",

						function () {
							that.dragging = true;
						}
					);

					google.maps.event.addListener(_instance, "zoom_changed",

						function () {
							that.zoom = _instance.getZoom();
							that.center = _instance.getCenter();
						}
					);

					google.maps.event.addListener(_instance, "center_changed",

						function () {
							that.center = _instance.getCenter();
						}
					);


					// Attach additional event listeners if needed
					if (_handlers.length) {

						angular.forEach(_handlers, function (h, i) {

							google.maps.event.addListener(_instance,
								h.on, h.handler);
						});
					}
				}
				else {
					console.log('REFRESHING?');
					// Refresh the existing instance
					google.maps.event.trigger(_instance, "resize");

					var instanceCenter = _instance.getCenter();

					if (!floatEqual(instanceCenter.lat(), that.center.lat())
						|| !floatEqual(instanceCenter.lng(), that.center.lng())) {
						_instance.setCenter(that.center);
					}

					if (_instance.getZoom() != that.zoom) {
						_instance.setZoom(that.zoom);
					}
				}
			};

			this.fit = function () {
				if (_instance && _markers.length) {

					var bounds = new google.maps.LatLngBounds();

					angular.forEach(_markers, function (m, i) {
						bounds.extend(m.getPosition());
					});

					_instance.fitBounds(bounds);
				}
			};

			this.on = function(event, handler) {
				_handlers.push({
					"on": event,
					"handler": handler
				});
			};

			this.addMarker = function (lat, lng, label, url,
																 thumbnail) {

				if (that.findMarker(lat, lng) != null) {
					return;
				}

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, lng),
					map: _instance
				});

				if (label) {

				}

				if (url) {

				}

				// Cache marker
				_markers.unshift(marker);

				// Cache instance of our marker for scope purposes
				that.markers.unshift({
					"lat": lat,
					"lng": lng,
					"draggable": false,
					"label": label,
					"url": url,
					"thumbnail": thumbnail
				});

				// Return marker instance
				return marker;
			};

			this.findMarker = function (lat, lng) {
				for (var i = 0; i < _markers.length; i++) {
					var pos = _markers[i].getPosition();

					if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
						return _markers[i];
					}
				}

				return null;
			};

			this.findMarkerIndex = function (lat, lng) {
				for (var i = 0; i < _markers.length; i++) {
					var pos = _markers[i].getPosition();

					if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
						return i;
					}
				}

				return -1;
			};

			this.addInfoWindow = function (lat, lng, html) {
				var win = new google.maps.InfoWindow({
					content: html,
					position: new google.maps.LatLng(lat, lng)
				});

				_windows.push(win);

				return win;
			};

			this.hasMarker = function (lat, lng) {
				return that.findMarker(lat, lng) !== null;
			};

			this.getMarkerInstances = function () {
				return _markers;
			};

			this.removeMarkers = function (markerInstances) {

				var s = this;

				angular.forEach(markerInstances, function (v, i) {
					var pos = v.getPosition(),
						lat = pos.lat(),
						lng = pos.lng(),
						index = s.findMarkerIndex(lat, lng);

					// Remove from local arrays
					_markers.splice(index, 1);
					s.markers.splice(index, 1);

					// Remove from map
					v.setMap(null);
				});
			};

			this.addPath = function(path){
				var s = this;
				var decodedPath = google.maps.geometry.encoding.decodePath(path.path);

				s.paths.push(path);

				var pathDisplay = new google.maps.Polyline({
					strokeColor : path.color,
					strokeOpacity : 0.9,
					strokeWeight : 6,
					path : decodedPath,
					map : _instance
				});
			}

			this.addStopMarkers = function(line){
				var s = this;

				function div(name){
					var m = document.createElement('DIV');
					m.innerHTML = '<div class="stop-marker '+name+'-marker" style="width: 30px; height: 30px;"></div>';
					return m;
				}

				angular.forEach(s.paths, function(v,i){
					if(v.name == line.name){
						angular.forEach(line.stops, function(stop, i){
							var marker = new RichMarker({
								map: _instance,
								position : new google.maps.LatLng(stop.position.lat, stop.position.long),
								anchor : RichMarkerPosition.MIDDLE,
								content : div(line.name),
								flat : true
							});
							stop.line = line.name;
							s.attachInfoWindow(marker, stop);
						});
					}
				});
			}


			this.drawCircles = function(){
				var circleDrawn = false;
				google.maps.event.addListener(_instance, 'idle', function() {
					//if(!circleDrawn){
					console.log('Map idle, drawing circles');
					drawCircles();
					circleDrawn = true;
					//}
				});
				google.maps.event.addListener(_instance, 'tilesloaded', function() {
					//i//f(!circleDrawn){
					console.log('Tiles Loaded, drawing circles');
					drawCircles();
					circleDrawn = true;
					//}
				});

				function drawCircles(){
					console.log('drawing circles');
					$('.stop-marker').svg({onLoad: function(svg){
						svg.circle(15, 15, 10, {fill: 'white', strokeWidth: 3});
						console.log('Drawn circles');
					}
					});
				}
			}

			this.attachInfoWindow = function(marker, stop){
				var s = this;
				function createInfoWindow(name){
					return new InfoBox({
						content : '<div class="infobox">'+name+'</div>',
						boxStyle :{
							opacity : 0.75
						},
						closeBoxURL : "",
						maxWidth : 100,
						pixelOffset: new google.maps.Size(-50, -60),
						infoBoxClearance: new google.maps.Size(2,2)
					});
				}

				var infoWindow = createInfoWindow(stop.name);
				google.maps.event.addListener(marker, 'click', function(){
					infoWindow.open(_instance, marker);
					//clickedMarker = !clickedMarker;
					//toggleSidebar(stop);
					s.clickHandler(stop, infoWindow);

					//zoom into location
					_instance.panTo(new google.maps.LatLng(stop.position.lat, stop.position.long));
					_instance.setZoom(17);

				});
				google.maps.event.addListener(marker, 'mouseover', function(){
					infoWindow.open(_instance, marker);
					s.hoverHandler(stop, infoWindow);
				});
				google.maps.event.addListener(marker, 'mouseout', function(){
					s.outHandler(infoWindow);
				});
			}
		}

		// Done
		return PrivateMapModel;
	}());

	// End model

	// Start Angular directive

	var googleMapsModule = angular.module("google-maps", ["trainguideServices"]);

	/**
	 * Map directive
	 */
	googleMapsModule.directive("googleMap", ["$log", "$timeout", "CommonAppState", function ($log, $timeout, CommonAppState) {

		return {
			restrict: "EC",
			priority: 100,
			transclude: true,
			template: "<div class='angular-google-map' ng-transclude></div>",
			replace: false,
			scope: {
				center: "=center", // required
				markers: "=markers", // optional
				latitude: "=latitude", // required
				longitude: "=longitude", // required
				zoom: "=zoom", // optional, default 8
				refresh: "&refresh", // optional
				windows: "=windows", // optional"
				paths: "=paths",
				stopMarkers : "=stopMarkers"
			},
			link: function (scope, element, attrs, ctrl) {

				// Center property must be specified and provide lat &
				// lng properties
				if (!angular.isDefined(scope.center) ||
					(!angular.isDefined(scope.center.lat) ||
						!angular.isDefined(scope.center.lng))) {

					$log.error("Could not find a valid center property");

					return;
				}

				angular.element(element).addClass("angular-google-map");

				// Create our model
				var _m = new MapModel({
					container: element[0],

					center: new google.maps.LatLng(scope.center.lat,
						scope.center.lng),

					draggable: attrs.draggable == "true",

					zoom: scope.zoom
				});

				_m.on("drag", function () {

					var c = _m.center;

					$timeout(function () {

						scope.$apply(function (s) {
							scope.center.lat = c.lat();
							scope.center.lng = c.lng();
						});
					});
				});

				_m.on("zoom_changed", function () {

					if (scope.zoom != _m.zoom) {

						$timeout(function () {

							scope.$apply(function (s) {
								scope.zoom = _m.zoom;
							});
						});
					}
				});

				_m.on("center_changed", function () {
					var c = _m.center;

					$timeout(function () {

						scope.$apply(function (s) {

							if (!_m.dragging) {
								scope.center.lat = c.lat();
								scope.center.lng = c.lng();
							}
						});
					});
				});

				_m.on("station_clicked", function(){
					$timeout(function(){
						console.log('station clicked');

					});
				});

				_m.clickHandler = function(stop, infoWindow){
					scope.selectedWindow = infoWindow;
					CommonAppState.prepForBroadcast("selectedStop", stop);
				};

				_m.hoverHandler = function(stop, infoWindow){

				};

				_m.outHandler = function(infoWindow){
					if(infoWindow != scope.selectedWindow){
						infoWindow.close();
					}
				};

				scope.previousSelectedStop = null;
				scope.$on('handleBroadcast[selectedStop]', function(){
					console.log('Broadcasting Stop');
					scope.center = {
						lat: CommonAppState.selectedStop.position.lat,
						lng: CommonAppState.selectedStop.position.long
					};
					if(scope.previousSelectedStop){
						if(scope.previousSelectedStop.name == CommonAppState.selectedStop.name){
							scope.selectedWindow.close();
							scope.selectedWindow = null;
							scope.previousSelectedStop = null;
							return;
						}
					}
					scope.previousSelectedStop = CommonAppState.selectedStop;
					scope.$apply();
				});

				// Put the map into the scope
				scope.map = _m;
				_m.draw();

				// Check if we need to refresh the map
				if (!scope.hasOwnProperty('refresh')) {
					// No refresh property given; draw the map immediately
					_m.draw();
				}
				else {
					scope.$watch("refresh()", function (newValue, oldValue) {
						if (newValue && !oldValue) {
							_m.draw();
						}
					});
				}


				//StopMarkers
				scope.$watch("stopMarkers", function(newValue, oldValue){
					$timeout(function(){
						angular.forEach(newValue, function(v,i){
							_m.addStopMarkers(v);
						});
						_m.drawCircles();
					});
				}, true);

				//Paths
				scope.$watch("paths", function(newValue, oldValue){
					$timeout(function(){
						angular.forEach(newValue, function(v,i){
							_m.addPath(v);
						});
					});
				}, true);


				// Update map when center coordinates change
				scope.$watch("center", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}

					if (!_m.dragging) {
						_m.center = new google.maps.LatLng(newValue.lat,
							newValue.lng);
						_m.draw();
					}
				}, true);

				scope.$watch("zoom", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}

					_m.zoom = newValue;
					_m.draw();
				});
			}
		};
	}]);
}());