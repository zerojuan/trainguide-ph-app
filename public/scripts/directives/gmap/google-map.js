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
				that = this,
				currentInfoWindow = null;

			this.center = opts.center;
			this.zoom = o.zoom;
			this.draggable = o.draggable;
			this.dragging = false;
			this.selector = o.container;
			this.markers = [];
			this.options = o.options;
			this.paths = [];

			this.draw = function () {

				if (that.center == null) {
					// TODO log error
					return;
				}

				if (_instance == null) {

					// Create a new map instance
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

					_instance = new google.maps.Map(that.selector, angular.extend(that.options, {
						center: that.center,
						zoom: that.zoom,
						draggable: that.draggable,
						mapTypeId : google.maps.MapTypeId.ROADMAP,
						styles: mapStyle,
						disableDefaultUI: true,
						zoomControl: true
					}));

					console.log("_instance is ready", _instance);

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

			this.addMarker = function (lat, lng, icon, infoWindowContent, label, url,
																 thumbnail) {

				if (that.findMarker(lat, lng) != null) {
					return;
				}

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, lng),
					map: _instance,
					icon: icon
				});

				if (label) {

				}

				if (url) {

				}

				if (infoWindowContent != null) {
//					var infoWindow = new google.maps.InfoWindow({
//						content: infoWindowContent
//					});

					var infoWindow = new InfoBox({
						content: infoWindowContent,
						disableAutoPan: false,
						boxStyle: {
							opacity: 1,
							background: '#fff',
							overflow: 'none'
						},
						closeBoxURL: "images/close.png",
						maxWidth: 120,
						closeBoxMargin: '0px 0px 0px 0px',
						pixelOffset: new google.maps.Size(-60, 0),
//						infoBoxClearance: new google.maps.Size(2,2)
					});


					google.maps.event.addListener(marker, 'click', function() {
						if (currentInfoWindow != null) {
							currentInfoWindow.close();
						}
						infoWindow.open(_instance, marker);
						currentInfoWindow = infoWindow;
					});
				}

				// Cache marker
				_markers.unshift(marker);

				// Cache instance of our marker for scope purposes
				that.markers.unshift({
					"lat": lat,
					"lng": lng,
					"draggable": false,
					"icon": icon,
					"infoWindowContent": infoWindowContent,
					"label": label,
					"url": url,
					"thumbnail": thumbnail
				});

				// Return marker instance
				return marker;
			};

			this.__defineGetter__("instance", function(){
				return _instance;
			});

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

			this.addPath = function(path){
				var s = this;
				var decodedPath = google.maps.geometry.encoding.decodePath(path.path);

				s.paths.push(path);

				google.maps.Polyline({
					strokeColor: path.color,
					strokeOpacity : 0.9,
					strokeWeight : 6,
					path : decodedPath,
					map : _instance
				});
			}

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
		}

		// Done
		return PrivateMapModel;
	}());

	// End model

	// Start Angular directive

	var googleMapsModule = angular.module("google-maps", []);

	/**
	 * Map directive
	 */
	googleMapsModule.directive("googleMap", ["$log", "$timeout", "$filter", function ($log, $timeout,
																																										$filter) {

		var controller = function ($scope, $element) {
			var mapSubscribers = [];
			var _m = $scope.map;

			self.addInfoWindow = function (lat, lng, content) {
				_m.addInfoWindow(lat, lng, content);
			};

			this.registerMapListener= function(child){
				mapSubscribers.push(child);
			}

			this.onMapReady = function(map){
				console.log("Map Ready? ", map);
				console.log("How many listeners?", mapSubscribers.length);
				angular.forEach(mapSubscribers, function(val){
					val.onMapReady(map);
				});
			}
		};

		controller.$inject = ['$scope', '$element'];

		return {
			restrict: "ECA",
			priority: 100,
			transclude: true,
			template: "<div class='angular-google-map' ng-transclude></div>",
			replace: false,
			scope: {
				center: "=center", // required
				markers: "=markers", // optional
				latitude: "=latitude", // required
				longitude: "=longitude", // required
				zoom: "=zoom", // required
				refresh: "&refresh", // optional
				windows: "=windows", // optional
				events: "=events"
			},
			controller: controller,
			link: function (scope, element, attrs, ctrl) {

				// Center property must be specified and provide lat &
				// lng properties
				console.log("This is what the scope looks like: ", scope);
				if (!angular.isDefined(scope.center) ||
					(!angular.isDefined(scope.center.latitude) ||
						!angular.isDefined(scope.center.longitude))) {

					$log.error("angular-google-maps: could not find a valid center property");
					return;
				}

				if (!angular.isDefined(scope.zoom)) {
					$log.error("angular-google-maps: map zoom property not set");
					return;
				}

				angular.element(element).addClass("angular-google-map");

				// Parse options
				var opts = {options: {}};
				if (attrs.options) {
					opts.options = angular.fromJson(attrs.options);
				}

				// Create our model

				var _m = new MapModel(angular.extend(opts, {
					container: element[0],
					center: new google.maps.LatLng(scope.center.latitude, scope.center.longitude),
					draggable: attrs.draggable == "true",
					zoom: scope.zoom
				}));
				console.log("Is ME Draggable?", _m.draggable);

				_m.on("drag", function () {

					var c = _m.center;

					$timeout(function () {

						scope.$apply(function (s) {
							scope.center.latitude = c.lat();
							scope.center.longitude = c.lng();
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
								scope.center.latitude = c.lat();
								scope.center.longitude = c.lng();
							}
						});
					});
				});

				if (angular.isDefined(scope.events)) {
					for (var eventName in scope.events) {
						if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
							_m.on(eventName, function () {
								scope.events[eventName].apply(scope, [_m, eventName, arguments]);
							});
						}
					}
				}

				if (attrs.markClick == "true") {
					(function () {
						var cm = null;

						_m.on("click", function (e) {
							if (cm == null) {

								cm = {
									latitude: e.latLng.lat(),
									longitude: e.latLng.lng()
								};

								scope.markers.push(cm);
							}
							else {
								cm.latitude = e.latLng.lat();
								cm.longitude = e.latLng.lng();
							}


							$timeout(function () {
								scope.latitude = cm.latitude;
								scope.longitude = cm.longitude;
								scope.$apply();
							});
						});
					}());
				}

				// Put the map into the scope
				scope.map = _m;

				// Check if we need to refresh the map
				if (angular.isUndefined(scope.refresh())) {
					// No refresh property given; draw the map immediately
					console.log("Drawing the map immediately");
					_m.draw();
					ctrl.onMapReady(_m.instance);
				}
				else {
					scope.$watch("refresh()", function (newValue, oldValue) {
						if (newValue && !oldValue) {
							_m.draw();
							console.log("Refresh is true??");
							ctrl.onMapReady(_m.instance);
						}
					});
				}

				scope.$watch("paths", function(newValue, oldValue){
					$timeout(function(){
						angular.forEach(newValue, function(val, i){
							_m.addPath(v);
						});
					});
				});

				// Markers
				scope.$watch("markers", function (newValue, oldValue) {
					$timeout(function () {

						angular.forEach(newValue, function (v, i) {
							if (!_m.hasMarker(v.latitude, v.longitude)) {
								_m.addMarker(v.latitude, v.longitude, v.icon, v.infoWindow);
							}
						});

						// Clear orphaned markers
						var orphaned = [];

						angular.forEach(_m.getMarkerInstances(), function (v, i) {
							// Check our scope if a marker with equal latitude and longitude.
							// If not found, then that marker has been removed form the scope.

							var pos = v.getPosition(),
								lat = pos.lat(),
								lng = pos.lng(),
								found = false;

							// Test against each marker in the scope
							for (var si = 0; si < scope.markers.length; si++) {

								var sm = scope.markers[si];

								if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
									// Map marker is present in scope too, don't remove
									found = true;
								}
							}

							// Marker in map has not been found in scope. Remove.
							if (!found) {
								orphaned.push(v);
							}
						});

						orphaned.length && _m.removeMarkers(orphaned);

						// Fit map when there are more than one marker.
						// This will change the map center coordinates
						if (attrs.fit == "true" && newValue && newValue.length > 1) {
							_m.fit();
						}
					});

				}, true);


				// Update map when center coordinates change
				scope.$watch("center", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}

					if (!_m.dragging) {
						_m.center = new google.maps.LatLng(newValue.latitude,
							newValue.longitude);
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
