window.onload = function () {
  function addIcon(el, entity) {
    var html = el.innerHTML;
    el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
  }
  var icons = {
      'icon-close': '&#xe000;',
      'icon-sights': '&#xe001;',
      'icon-shopping': '&#xe002;',
      'icon-hotel': '&#xe003;',
      'icon-box-add': '&#xe007;',
      'icon-office': '&#xe008;',
      'icon-transfer': '&#xe009;',
      'icon-hospital': '&#xe00a;',
      'icon-protest': '&#xe00b;',
      'icon-blogger': '&#xe004;',
      'icon-facebook': '&#xe005;',
      'icon-twitter': '&#xe006;',
      'icon-search': '&#xe00c;'
    }, els = document.getElementsByTagName('*'), i, attr, html, c, el;
  for (i = 0;; i += 1) {
    el = els[i];
    if (!el) {
      break;
    }
    attr = el.getAttribute('data-icon');
    if (attr) {
      addIcon(el, attr);
    }
    c = el.className;
    c = c.match(/icon-[^\s'"]+/);
    if (c && icons[c[0]]) {
      addIcon(el, icons[c[0]]);
    }
  }
};
angular.module('trainguideServices', []);
angular.module('uiModule', ['trainguideServices']);
angular.module('google-maps', ['trainguideServices']);
angular.module('trainguide.controllers', ['trainguideServices']);
angular.module('trainguide', [
  'google-maps',
  'trainguide.controllers',
  'uiModule'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/:state');
  }
]);
angular.module('trainguide.controllers').controller('ViewerCtrl', [
  '$scope',
  '$http',
  '$routeParams',
  function ($scope, $http, $routeParams) {
    console.log($routeParams);
  }
]);
var app = angular.module('viewerApp', []);
app.config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: '/views/?url=viewer.partials.agencies',
      controller: 'ViewerCtrl'
    }).when('/:agency/routes', {
      templateUrl: '/views/?url=viewer.partials.routes',
      controller: 'RouteCtrl'
    }).when('/:agency/routes/:route/trips', {
      templateUrl: '/views/?url=viewer.partials.trips',
      controller: 'TripsCtrl'
    }).when('/:agency/routes/:route/trips/:trip/stops', {
      templateUrl: '/views/?url=viewer.partials.stops',
      controller: 'StopsCtrl'
    }).otherwise({ redirectTo: '/' });
  }
]);
angular.module('viewerApp').controller('ViewerCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
    $scope.header = 'Agencies';
    $scope.description = 'This is the data you guys';
    $scope.agencies = [];
    $http({
      method: 'GET',
      url: 'api/agencies'
    }).success(function (data) {
      console.log('Data is here!');
      console.log(data);
      $scope.agencies = data;
    }).error(function (data, status) {
      console.log('Error Happened');
    });
  }
]).controller('RouteCtrl', [
  '$scope',
  '$http',
  '$routeParams',
  function ($scope, $http, $routeParams) {
    $scope.agencyId = $routeParams.agency;
    $scope.routes = [];
    $http({
      method: 'GET',
      url: 'api/agencies/' + $routeParams.agency + '/routes'
    }).success(function (data) {
      console.log('Data is here!');
      console.log(data);
      $scope.routes = data;
    }).error(function (data, status) {
      console.log('Error happened');
    });
  }
]).controller('TripsCtrl', [
  '$scope',
  '$http',
  '$routeParams',
  function ($scope, $http, $routeParams) {
    $scope.agencyId = $routeParams.agency;
    $scope.routeId = $routeParams.route;
    $http({
      method: 'GET',
      url: 'api/routes/' + $scope.routeId + '/trips'
    }).success(function (data) {
      console.log(data);
      $scope.trips = data;
    }).error(function (data, status) {
      console.log('Error happened');
    });
  }
]).controller('StopsCtrl', [
  '$scope',
  '$http',
  '$routeParams',
  function ($scope, $http, $routeParams) {
    $scope.agencyId = $routeParams.agency;
    $scope.routeId = $routeParams.route;
    $scope.tripId = $routeParams.trip;
    $scope.url = 'api/trips/' + $scope.tripId + '/stops';
    $http({
      method: 'GET',
      url: $scope.url
    }).success(function (data) {
      console.log(data);
      $scope.stops = data;
    }).error(function (data, status) {
    });
  }
]);
angular.module('trainguide.controllers').controller('GMapCtrl', [
  '$scope',
  function ($scope) {
    angular.extend($scope, {
      centerProperty: {
        latitude: 14.5833,
        longitude: 121
      },
      zoomProperty: 14,
      markersProperty: [],
      refresh: true,
      pathsProperty: [],
      stopMarkersProperty: [],
      clickedLatitudeProperty: null,
      clickedLongitudeProperty: null
    });
  }
]);
angular.module('trainguide.controllers').controller('MainCtrl', [
  '$scope',
  '$http',
  '$route',
  'LinesService',
  'PlacesService',
  'CommonAppState',
  function ($scope, $http, $route, LinesService, PlacesService, CommonAppState) {
    $scope.showDetails = false;
    $scope.selected = {
      stop: null,
      line: null,
      sights: null,
      shops: null
    };
    $scope.$watch('selected.stop', function (newValue) {
      if (newValue) {
        $scope.menuItems[0].selected = false;
        $scope.selectedItemHandler($scope.menuItems[0]);
      }
    });
    $scope.menuItems = [
      {
        title: 'Line',
        selected: false
      },
      {
        title: 'Places',
        selected: false
      },
      {
        title: 'Download',
        selected: false
      },
      {
        title: 'Tips',
        selected: false
      }
    ];
    $scope.selectedItem = false;
    $scope.selectedItemHandler = function (item) {
      for (var i in $scope.menuItems) {
        if ($scope.menuItems[i].title == item.title) {
          $scope.menuItems[i].selected = !$scope.menuItems[i].selected;
          if ($scope.menuItems[i].selected) {
            if (item.title == 'Line' && !$scope.selected.line) {
              $scope.selected.line = $scope.lines.LRT1;
              $scope.showDetails = false;
            }
            $scope.selectedItem = $scope.menuItems[i];
          } else {
            $scope.selectedItem = false;
          }
        } else {
          $scope.menuItems[i].selected = false;
        }
      }
      if (!$scope.menuItems[0].selected) {
        $scope.selected.stop = null;
        $scope.showDetails = false;
      }
    };
    LinesService.getLines(function (data, status) {
      $scope.lines = data;
      for (key in data) {
        $scope.lines[key].name = key;
      }
      $scope.lines.LRT1.color = '#fdc33c';
      $scope.lines.LRT2.color = '#ad86bc';
      $scope.lines.MRT.color = '#5384c4';
      $scope.lines.PNR.color = '#f28740';
      $scope.getLineByName = function (name) {
        for (var i in $scope.lines) {
          console.log('i', i, 'name', name);
          if (i == name) {
            return $scope.lines[i];
          }
        }
        return null;
      };
    });
    $scope.getPlaces = function (qry) {
      PlacesService.getPlacesByCategory(qry.queryStr, function (data) {
        if (qry.category == 'Sightseeing') {
          $scope.selected.sights.totalcount = data.places.length;
          console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
        }
        if (qry.category == 'Shopping') {
          $scope.selected.shops.totalcount = data.places.length;
          console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
        }
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
    $scope.getLimitedPlaces = function (qry) {
      PlacesService.getPlacesByLimitedCategory(qry.category, qry.stopname, qry.start, qry.limit, function (data) {
        for (var item in data) {
          if (qry.category == 'Sightseeing') {
            $scope.selected.sights.push(data[item]);
            console.log('$scope.selected.sights.push(data[item]);', $scope.selected.sights);
          }
          if (qry.category == 'Shopping') {
            $scope.selected.shops.push(data[item]);
            console.log('$scope.selected.shops.push(data[item]);', $scope.selected.shops);
          }
        }
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
  }
]);
angular.module('trainguide.controllers').controller('PlaceCtrl', [
  '$scope',
  '$http',
  'LinesService',
  'PlacesService',
  function ($scope, $http, LinesService, PlacesService) {
    $scope.places = [];
    $scope.activeCategories = PlacesService.activeCategories();
    $scope.selected = { category: $scope.activeCategories[0].name };
    var lines = null;
    LinesService.getLines(function (data) {
      lines = data;
      for (key in data) {
        lines[key].name = key;
      }
    });
    $scope.getPlaces = function (qry) {
      PlacesService.getPlacesByCategory(qry.queryStr, function (data) {
        $scope.places.totalcount = data.places.length;
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
    $scope.getLimitedPlaces = function (qry) {
      PlacesService.getPlacesByLimitedCategory(qry.category, qry.stopname, qry.start, qry.limit, function (data) {
        for (var item in data) {
          for (key in lines) {
            if (lines[key].shortName == data[item].line.name) {
              data[item].line.line_name = lines[key].name;
            }
          }
          $scope.places.push(data[item]);
        }
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
  }
]);
(function () {
  'use strict';
  function floatEqual(f1, f2) {
    return Math.abs(f1 - f2) < 0.000001;
  }
  var MapModel = function () {
      var _defaults = {
          zoom: 8,
          draggable: false,
          container: null
        };
      function PrivateMapModel(opts) {
        var _instance = null, _markers = [], _handlers = [], _windows = [], o = angular.extend({}, _defaults, opts), that = this, currentInfoWindow = null;
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
            return;
          }
          if (_instance == null) {
            var mapStyle = [
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [
                    { hue: '#8800ff' },
                    { lightness: 100 }
                  ]
                },
                {
                  featureType: 'transit.station',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'transit.station.rail',
                  stylers: [{ visibility: 'on' }]
                },
                {
                  featureType: 'transit.station',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'road',
                  stylers: [
                    { visibility: 'on' },
                    { hue: '#91ff00' },
                    { saturation: -62 },
                    { gamma: 1.98 },
                    { lightness: 45 }
                  ]
                },
                {
                  featureType: 'water',
                  stylers: [
                    { hue: '#005eff' },
                    { gamma: 0.72 },
                    { lightness: 42 }
                  ]
                },
                {
                  featureType: 'transit.line',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'administrative.locality',
                  stylers: [{ visibility: 'on' }]
                },
                {
                  featureType: 'administrative.neighborhood',
                  elementType: 'geometry',
                  stylers: [{ visibility: 'simplified' }]
                },
                {
                  featureType: 'landscape',
                  stylers: [
                    { visibility: 'on' },
                    { gamma: 0.41 },
                    { lightness: 46 }
                  ]
                },
                {
                  featureType: 'administrative.neighborhood',
                  elementType: 'labels.text',
                  stylers: [
                    { visibility: 'off' },
                    { saturation: 33 },
                    { lightness: 20 }
                  ]
                }
              ];
            _instance = new google.maps.Map(that.selector, angular.extend(that.options, {
              center: that.center,
              zoom: that.zoom,
              draggable: that.draggable,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: mapStyle,
              disableDefaultUI: true
            }));
            console.log('_instance is ready', _instance);
            google.maps.event.addListener(_instance, 'dragstart', function () {
              that.dragging = true;
            });
            google.maps.event.addListener(_instance, 'idle', function () {
              that.dragging = false;
            });
            google.maps.event.addListener(_instance, 'drag', function () {
              that.dragging = true;
            });
            google.maps.event.addListener(_instance, 'zoom_changed', function () {
              that.zoom = _instance.getZoom();
              that.center = _instance.getCenter();
            });
            google.maps.event.addListener(_instance, 'center_changed', function () {
              that.center = _instance.getCenter();
            });
            if (_handlers.length) {
              angular.forEach(_handlers, function (h, i) {
                google.maps.event.addListener(_instance, h.on, h.handler);
              });
            }
          } else {
            google.maps.event.trigger(_instance, 'resize');
            var instanceCenter = _instance.getCenter();
            if (!floatEqual(instanceCenter.lat(), that.center.lat()) || !floatEqual(instanceCenter.lng(), that.center.lng())) {
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
        this.on = function (event, handler) {
          _handlers.push({
            'on': event,
            'handler': handler
          });
        };
        this.addMarker = function (lat, lng, icon, infoWindowContent, label, url, thumbnail) {
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
            var infoWindow = new InfoBox({
                content: infoWindowContent,
                disableAutoPan: false,
                boxStyle: {
                  opacity: 1,
                  background: '#fff',
                  overflow: 'none'
                },
                closeBoxURL: 'images/close.png',
                maxWidth: 120,
                closeBoxMargin: '0px 0px 0px 0px',
                pixelOffset: new google.maps.Size(-60, 0)
              });
            google.maps.event.addListener(marker, 'click', function () {
              if (currentInfoWindow != null) {
                currentInfoWindow.close();
              }
              infoWindow.open(_instance, marker);
              currentInfoWindow = infoWindow;
            });
          }
          _markers.unshift(marker);
          that.markers.unshift({
            'lat': lat,
            'lng': lng,
            'draggable': false,
            'icon': icon,
            'infoWindowContent': infoWindowContent,
            'label': label,
            'url': url,
            'thumbnail': thumbnail
          });
          return marker;
        };
        this.__defineGetter__('instance', function () {
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
        this.addPath = function (path) {
          var s = this;
          var decodedPath = google.maps.geometry.encoding.decodePath(path.path);
          s.paths.push(path);
          google.maps.Polyline({
            strokeColor: path.color,
            strokeOpacity: 0.9,
            strokeWeight: 6,
            path: decodedPath,
            map: _instance
          });
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
            var pos = v.getPosition(), lat = pos.lat(), lng = pos.lng(), index = s.findMarkerIndex(lat, lng);
            _markers.splice(index, 1);
            s.markers.splice(index, 1);
            v.setMap(null);
          });
        };
      }
      return PrivateMapModel;
    }();
  var googleMapsModule = angular.module('google-maps', []);
  googleMapsModule.directive('googleMap', [
    '$log',
    '$timeout',
    '$filter',
    function ($log, $timeout, $filter) {
      var controller = function ($scope, $element) {
        var mapSubscribers = [];
        var _m = $scope.map;
        self.addInfoWindow = function (lat, lng, content) {
          _m.addInfoWindow(lat, lng, content);
        };
        this.registerMapListener = function (child) {
          mapSubscribers.push(child);
        };
        this.onMapReady = function (map) {
          console.log('Map Ready? ', map);
          console.log('How many listeners?', mapSubscribers.length);
          angular.forEach(mapSubscribers, function (val) {
            val.onMapReady(map);
          });
        };
      };
      controller.$inject = [
        '$scope',
        '$element'
      ];
      return {
        restrict: 'ECA',
        priority: 100,
        transclude: true,
        template: '<div class=\'angular-google-map\' ng-transclude></div>',
        replace: false,
        scope: {
          center: '=center',
          markers: '=markers',
          latitude: '=latitude',
          longitude: '=longitude',
          zoom: '=zoom',
          refresh: '&refresh',
          windows: '=windows',
          events: '=events'
        },
        controller: controller,
        link: function (scope, element, attrs, ctrl) {
          console.log('This is what the scope looks like: ', scope);
          if (!angular.isDefined(scope.center) || (!angular.isDefined(scope.center.latitude) || !angular.isDefined(scope.center.longitude))) {
            $log.error('angular-google-maps: could not find a valid center property');
            return;
          }
          if (!angular.isDefined(scope.zoom)) {
            $log.error('angular-google-maps: map zoom property not set');
            return;
          }
          angular.element(element).addClass('angular-google-map');
          var opts = { options: {} };
          if (attrs.options) {
            opts.options = angular.fromJson(attrs.options);
          }
          var _m = new MapModel(angular.extend(opts, {
              container: element[0],
              center: new google.maps.LatLng(scope.center.latitude, scope.center.longitude),
              draggable: attrs.draggable == 'true',
              zoom: scope.zoom
            }));
          console.log('Is ME Draggable?', _m.draggable);
          _m.on('drag', function () {
            var c = _m.center;
            $timeout(function () {
              scope.$apply(function (s) {
                scope.center.latitude = c.lat();
                scope.center.longitude = c.lng();
              });
            });
          });
          _m.on('zoom_changed', function () {
            if (scope.zoom != _m.zoom) {
              $timeout(function () {
                scope.$apply(function (s) {
                  scope.zoom = _m.zoom;
                });
              });
            }
          });
          _m.on('center_changed', function () {
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
                  scope.events[eventName].apply(scope, [
                    _m,
                    eventName,
                    arguments
                  ]);
                });
              }
            }
          }
          if (attrs.markClick == 'true') {
            (function () {
              var cm = null;
              _m.on('click', function (e) {
                if (cm == null) {
                  cm = {
                    latitude: e.latLng.lat(),
                    longitude: e.latLng.lng()
                  };
                  scope.markers.push(cm);
                } else {
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
          scope.map = _m;
          if (angular.isUndefined(scope.refresh())) {
            console.log('Drawing the map immediately');
            _m.draw();
            ctrl.onMapReady(_m.instance);
          } else {
            scope.$watch('refresh()', function (newValue, oldValue) {
              if (newValue && !oldValue) {
                _m.draw();
                console.log('Refresh is true??');
                ctrl.onMapReady(_m.instance);
              }
            });
          }
          scope.$watch('paths', function (newValue, oldValue) {
            $timeout(function () {
              angular.forEach(newValue, function (val, i) {
                _m.addPath(v);
              });
            });
          });
          scope.$watch('markers', function (newValue, oldValue) {
            $timeout(function () {
              angular.forEach(newValue, function (v, i) {
                if (!_m.hasMarker(v.latitude, v.longitude)) {
                  _m.addMarker(v.latitude, v.longitude, v.icon, v.infoWindow);
                }
              });
              var orphaned = [];
              angular.forEach(_m.getMarkerInstances(), function (v, i) {
                var pos = v.getPosition(), lat = pos.lat(), lng = pos.lng(), found = false;
                for (var si = 0; si < scope.markers.length; si++) {
                  var sm = scope.markers[si];
                  if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                    found = true;
                  }
                }
                if (!found) {
                  orphaned.push(v);
                }
              });
              orphaned.length && _m.removeMarkers(orphaned);
              if (attrs.fit == 'true' && newValue && newValue.length > 1) {
                _m.fit();
              }
            });
          }, true);
          scope.$watch('center', function (newValue, oldValue) {
            if (newValue === oldValue) {
              return;
            }
            if (!_m.dragging) {
              _m.center = new google.maps.LatLng(newValue.latitude, newValue.longitude);
              _m.draw();
            }
          }, true);
          scope.$watch('zoom', function (newValue, oldValue) {
            if (newValue === oldValue) {
              return;
            }
            _m.zoom = newValue;
            _m.draw();
          });
        }
      };
    }
  ]);
}());
'use strict';
angular.module('google-maps').factory('DirectionsService', function () {
  var directionService = {};
  var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: false });
  var _directionsService = new google.maps.DirectionsService();
  directionService.setMap = function setMap(map) {
    directionsDisplay.setMap(map);
  };
  directionService.calcRoute = function calcRoute(start, end, callback) {
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.WALKING
      };
    _directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  };
  return directionService;
}).directive('mapRouter', [
  'DirectionsService',
  function (DirectionsService) {
    return {
      require: '^googleMap',
      restrict: 'E',
      scope: {
        selectedStop: '=selectedStop',
        selectedDest: '=selectedDest'
      },
      link: function (scope, elm, attrs, ctrl) {
        ctrl.registerMapListener(scope);
        scope.onMapReady = function (map) {
          console.log('Map is here!', map);
          scope.map = map;
        };
        scope.$watch('map', function () {
          DirectionsService.setMap(scope.map);
        });
        scope.$watch('selectedDest', function () {
          var start = new google.maps.LatLng(scope.selectedStop.position.lat, scope.selectedStop.position.long);
          var end = new google.maps.LatLng(scope.selectedDest.latlng.lat, scope.selectedDest.latlng.lng);
          DirectionsService.calcRoute(start, end);
        });
      },
      replace: true,
      template: '<div></div>'
    };
  }
]);
'use strict';
angular.module('google-maps').directive('polylineDrawer', [
  'CommonAppState',
  function (CommonAppState) {
    return {
      require: '^googleMap',
      restrict: 'E',
      scope: {
        paths: '=paths',
        selectedStop: '=selectedStop',
        selectedLine: '=selectedLine',
        showDetails: '=showDetails',
        selectedItem: '=selectedItem'
      },
      link: function (scope, elm, attrs, gmapCtrl) {
        gmapCtrl.registerMapListener(scope);
        scope.onMapReady = function (map) {
          scope.map = map;
        };
        var setLine = function () {
          for (var line in scope.paths) {
            if (scope.selectedStop.details.stop_name.indexOf(line) != -1) {
              scope.selectedLine = scope.paths[line];
            } else {
              for (var lineStop in scope.paths[line].stops) {
                if (scope.selectedStop.details.stop_name.indexOf(scope.paths[line].stops[lineStop].details.stop_name) != -1) {
                  scope.selectedLine = scope.paths[line];
                  break;
                }
              }
            }
          }
        };
        var div = function (name) {
          var m = document.createElement('DIV');
          m.innerHTML = '<div class="stop-marker ' + name + '-marker" style="width: 20px; height: 20px;"></div>';
          return m;
        };
        var drawLines = function () {
          for (var prop in scope.paths) {
            var path = scope.paths[prop];
            var decodedPath = google.maps.geometry.encoding.decodePath(path.path);
            var line = new google.maps.Polyline({
                strokeColor: path.color,
                strokeOpacity: 0.9,
                strokeWeight: 6,
                path: decodedPath
              });
            line.setMap(scope.map);
            angular.forEach(path.stops, function (stop) {
              var marker = new RichMarker({
                  map: scope.map,
                  position: new google.maps.LatLng(stop.details.stop_lat, stop.details.stop_lon),
                  anchor: RichMarkerPosition.MIDDLE,
                  content: div(path.name),
                  flat: true
                });
              google.maps.event.addListener(marker, 'click', function () {
                scope.selectedStop = stop;
                setLine();
                scope.$apply('selectedStop');
              });
            });
          }
        };
        scope.$watch('selectedStop', function (newValue) {
          if (scope.selectedStop) {
            scope.showDetails = true;
            var position = new google.maps.LatLng(scope.selectedStop.details.stop_lat, scope.selectedStop.details.stop_lon);
            scope.map.setCenter(position);
            setLine();
          }
        });
        scope.$watch('paths', function () {
          if (scope.map && scope.paths) {
            drawLines();
          }
        });
        scope.$watch('map', function () {
          if (scope.map && scope.paths) {
            drawLines();
          }
        });
      }
    };
  }
]);
'use strict';
angular.module('uiModule').directive('categories', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      categories: '=',
      selectedCategory: '='
    },
    link: function (scope, element) {
      scope.$watch('selectedCategory', function (newValue, oldValue) {
        console.log('selectedCategory', newValue);
      });
      console.log('categories', scope.categories);
      scope.setCategory = function (category) {
        scope.selectedCategory = category;
      };
    },
    template: '<div class="categories-list" ng-transclude>' + '<div>' + '<ul>' + '<li ng-show="category.icon" ng-repeat="category in categories" ng-class="{\'selected\': selectedCategory==category.name}">' + '<i class="{{category.icon}}" ng-click="setCategory(category.name)" ng-class="{\'selected\': selectedCategory==category.name}"></i>' + '<div ng-show="selectedCategory==category.name" class="highlight"></div>' + '</li>' + '</ul>' + '</div>' + '<h6>Featured</h6>' + '</div>',
    replace: true
  };
});
'use strict';
angular.module('uiModule').directive('lines', [
  'CommonAppState',
  function (CommonAppState) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        lines: '=lines',
        selectedStop: '=selectedStop',
        selectedLine: '=selectedLine',
        showDetails: '=showDetails'
      },
      link: function (scope, element) {
        console.log('lines.js selectedStop', scope.selectedStop);
        scope.$watch('selectedStop', function (newValue, oldValue) {
          if (newValue) {
            element.find('.stop-desc').html('<h2>' + newValue.details.stop_name + '</h2>');
          }
        });
        scope.lineSelected = function (line) {
          scope.selectedLine = line;
          scope.selectedStop = null;
          scope.showDetails = false;
        };
      },
      template: '<div class="line-nav clearfix {{selectedLine.name}}" ng-transclude>' + '<ul>' + '<li ng-repeat="i in lines" class="{{i.name}}" ng-class="{active:i.name == selectedLine.name}" ng-click="lineSelected(i)">' + '{{i.shortName}}' + '</li>' + '</ul>' + '<div class="stop-desc" ng-class="{true:\'showdetails\', false:\'nodetails\'}[showDetails]"></div>' + '<table class="line-desc" ng-class="{true:\'nodetails\', false:\'showdetails\'}[showDetails]">' + '<tr>' + '<td>Weekdays: {{selectedLine.weekdays}}</td>' + '</tr>' + '<tr>' + '<td>Weekend: {{selectedLine.weekend}}</td>' + '</tr>' + '<tr>' + '<td>Stored Value Card: {{selectedLine.svc}}</td>' + '</tr>' + '</table>' + '<table class="contact-desc" ng-class="{true:\'nodetails\', false:\'showdetails\'}[showDetails]">' + '<th>Contact</th>' + '<tr>' + '<td>Web: {{selectedLine.web}}</td>' + '</tr>' + '<tr>' + '<td>Twitter: {{selectedLine.twitter}}</td>' + '</tr>' + '<tr>' + '<td>Contact No.: {{selectedLine.contactNo}}</td>' + '</tr>' + '<tr>' + '<td>Fare: {{selectedLine.fare}}</td>' + '</tr>' + '<tr>' + '<td>Email: {{selectedLine.email}}</td>' + '</tr>' + '</table>' + '</div>',
      replace: true
    };
  }
]);
'use strict';
angular.module('uiModule').directive('lineStops', [
  'CommonAppState',
  function (CommonAppState) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        selectedItem: '=selectedItem',
        selectedLine: '=selectedLine',
        selectedStop: '=selectedStop',
        showDetails: '=showDetails'
      },
      link: function (scope, element, attr) {
        var y = null;
        var svgHeight = $(window).height() - 130;
        var svg = d3.select('#line-stop-svg').append('svg').attr('class', 'line-stop-chart').attr('width', 260).attr('height', svgHeight);
        var lineWidth = 10;
        var centerX = 130;
        svg.append('rect').attr('class', 'vertical').attr('x', centerX - lineWidth / 2).attr('width', lineWidth).attr('y', 20);
        scope.$watch('selectedLine', function (newValue, oldValue) {
          if (newValue && newValue.stops) {
            y = d3.scale.linear().domain([
              0,
              newValue.stops.length - 1
            ]).range([
              0,
              svgHeight - 30
            ]);
            for (var i in newValue.stops) {
              svg.selectAll('.vertical').attr('height', svgHeight - 30).attr('class', 'vertical ' + newValue.name);
              svg.selectAll('.transfer').remove();
              var dots = svg.selectAll('.stop').data(newValue.stops, function (d) {
                  return d.stop_id;
                });
              dots.enter().append('circle').attr('class', function (d, i) {
                var _class = 'stop ';
                if (d.transfer) {
                  svg.append('rect').attr('class', 'transfer').attr('x', centerX + 9).attr('y', y(i) + 15).attr('width', 20).attr('height', 10).attr('fill', '#333');
                  svg.append('circle').attr('class', 'transfer ' + d.transfer.line).attr('cx', centerX + 25).attr('cy', y(i) + 20).attr('r', 8);
                  return _class += 'Transferee';
                }
                return _class += newValue.name;
              }).attr('cx', centerX).attr('cy', function (d, i) {
                return y(i) + 20;
              }).attr('r', function (d, i) {
                if (d.transfer) {
                  return 8;
                }
                if (i == 0 || i == newValue.stops.length - 1) {
                  return 8;
                }
                return 5;
              }).on('click', function (d) {
                scope.onSelectedStop(d);
              });
              dots.exit().remove();
              var text = svg.selectAll('.label').data(newValue.stops, function (d) {
                  return d.stop_id;
                });
              text.enter().append('text').attr('class', function (d, i) {
                var _class = 'label';
                if (d.transfer) {
                  var names = d.transfer.details.stop_name.split(' ');
                  svg.append('text').attr('class', 'transfer').attr('x', centerX + 40).attr('y', y(i) + 23).text(function () {
                    return names[0].toUpperCase();
                  });
                  if (names.length > 1) {
                    svg.append('text').attr('class', 'transfer').attr('x', centerX + 40).attr('y', y(i) + 33).text(function () {
                      return names[1].toUpperCase();
                    });
                  }
                }
                if (i == 0 || i == newValue.stops.length - 1) {
                  return _class + ' ends';
                }
                return _class;
              }).attr('x', centerX - 20).attr('y', function (d, i) {
                return y(i) + 23;
              }).text(function (d, i) {
                if (i == 0 || i == newValue.stops.length - 1) {
                  return d.details.stop_name.toUpperCase();
                }
                return d.details.stop_name;
              });
              text.exit().remove();
            }
          }
        });
        scope.onSelectedStop = function (stop) {
          for (var i in scope.selectedLine.stops) {
            stop.line = scope.selectedLine.stops[i].details.stop_name;
          }
          console.log('BROADCASTING FROM LINESTOPS');
          scope.selectedStop = stop;
          scope.showDetails = true;
          scope.$apply();
        };
        scope.$watch('selectedStop', function (newValue, oldValue) {
          if (scope.selectedLine) {
            scope.showDetails = true;
          }
          if (scope.selectedStop == null) {
            scope.showDetails = false;
          }
        });
      },
      template: '<div class="line-stops" ng-transclude>' + '<div id="line-stop-svg">' + '</div>' + '</div>',
      replace: true
    };
  }
]);
'use strict';
angular.module('uiModule').directive('places', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      selectedCategory: '=',
      getPlacesCount: '=',
      onQueryPlaces: '=',
      places: '='
    },
    link: function (scope, element) {
      var query = {};
      scope.$watch('selectedCategory', function (newValue, oldValue) {
        console.log('newValue', newValue);
        query.queryStr = newValue;
        if (newValue) {
          scope.places = [];
          scope.counter = 0;
          scope.loadPlaces(0, newValue);
          scope.getPlacesCount(query);
        }
      });
      var limit = 20;
      scope.loadPlaces = function (counter, selectedCategory) {
        var qry = {
            limit: limit,
            start: counter * limit,
            category: selectedCategory,
            stopname: ''
          };
        scope.onQueryPlaces(qry);
        $('.antiscroll-wrap').antiscroll();
      };
    },
    template: '<div>' + '<div class="antiscroll-wrap">' + '<div class="block">' + '<div class="antiscroll-inner">' + '<div class="places-list" ng-transclude>' + '<ul>' + '<li ng-repeat="place in places">' + '<span class="name">{{place.name}}</span>' + '<span class="dist">{{place.distance}}</span>' + '<div class="{{place.line.line_name}} square"></div>' + '</li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a ng-show="counter*20<=places.totalcount-20" ng-click="loadPlaces(counter=counter+1, selectedCategory)">Load more...</a>' + '</div>',
    replace: true
  };
});
angular.module('uiModule').directive('radioGroup', [function () {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div>' + '<ul>' + '<li ng-repeat="i in menuItems">' + '<a ng-click="navClick(i)" ng-class="{active:i.selected}" href="#{{i.title}}"><span>{{i.title}}</span></a>' + '</li>' + '</ul>' + '</div>',
      scope: {
        menuItems: '=menuItems',
        selectedItemHandler: '=selectedItemHandler',
        selectedItem: '=selectedItem',
        showDetails: '=showDetails'
      },
      link: function (scope, elm, attr, ctrl) {
        scope.previousItem = null;
        scope.navClick = function (item) {
          scope.selectedItemHandler(item);
          $('.container').removeClass('adjust');
          scope.showDetails = false;
        };
      },
      replace: true
    };
  }]);
'use strict';
angular.module('uiModule').directive('shopsSlide', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      selectedStop: '=',
      getPlacesCount: '=',
      onQueryPlaces: '=',
      shops: '='
    },
    link: function (scope, element, attr) {
      scope.$watch('selectedStop', function (newValue, oldValue) {
        if (newValue) {
          scope.stopname = newValue.details.stop_name;
          scope.shops = [];
          scope.counter = 0;
          scope.loadPlaces(0);
          scope.getPlacesCount(scope.stopname);
        }
      });
      var limit = 5;
      scope.loadPlaces = function (counter) {
        var qry = {
            limit: limit,
            start: counter * limit,
            category: 'Shopping',
            stopname: scope.stopname
          };
        console.log('shops qry', qry);
        scope.onQueryPlaces(qry);
        $('.antiscroll-wrap').antiscroll();
      };
    },
    template: '<div class="shops-box">' + '<div><h3>Shopping</h3><i class="icon-shopping"></i></div>' + '<ul>' + '<li ng-repeat="shop in shops">' + '<div>' + '<span class="name">{{shop.name}}</span>' + '<span class="distance">{{shop.distance}}</span>' + '</div>' + '</li>' + '<li ng-show="!shops.length">No shops near the area.</li>' + '</ul>' + '<a ng-show="counter*5<=shops.totalcount-5" ng-click="loadPlaces(counter=counter+1)">More...</a>' + '</div>',
    replace: true
  };
});
'use strict';
angular.module('uiModule').directive('sightsSlide', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      selectedStop: '=',
      getPlacesCount: '=',
      onQueryPlaces: '=',
      sights: '='
    },
    link: function (scope, element, attr) {
      scope.$watch('selectedStop', function (newValue, oldValue) {
        if (newValue) {
          scope.stopname = newValue.details.stop_name;
          scope.sights = [];
          scope.counter = 0;
          scope.loadPlaces(0);
          scope.getPlacesCount(scope.stopname);
        }
      });
      var limit = 5;
      scope.loadPlaces = function (counter) {
        var qry = {
            limit: limit,
            start: counter * limit,
            category: 'Sightseeing',
            stopname: scope.stopname
          };
        console.log('sights qry', qry);
        scope.onQueryPlaces(qry);
        $('.antiscroll-wrap').antiscroll();
      };
    },
    template: '<div class="sights-box">' + '<div><h3>Sightseeing</h3><i class="icon-sights"></i></div>' + '<ul>' + '<li ng-repeat="sight in sights">' + '<div>' + '<span class="name">{{sight.name}}</span>' + '<span class="distance">{{sight.distance}}</span>' + '</div>' + '</li>' + '<li ng-show="!sights.length">No sights near the area.</li>' + '</ul>' + '<a ng-show="counter*5<=sights.totalcount-5" ng-click="loadPlaces(counter=counter+1)">More...</a>' + '</div>',
    replace: true
  };
});
'use strict';
angular.module('uiModule').directive('slide', [function () {
    return {
      require: '^slideGroup',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function (scope, element, attrs, slideGroup) {
        slideGroup.addSlide(scope);
      },
      template: '<div class="slide" ng-class="{active:selected}" ng-transclude></div>',
      replace: true
    };
  }]);
'use strict';
angular.module('uiModule').directive('slideGroup', [
  'CommonAppState',
  function (CommonAppState) {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div ng-transclude>' + '</div>',
      scope: {
        selectedItem: '=selectedItem',
        selectedStop: '=selectedStop',
        selectedLine: '=selectedLine',
        showDetails: '=showDetails'
      },
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          var slides = $scope.slides = [];
          $scope.selectByTitle = function (title) {
            angular.forEach(slides, function (slide) {
              if (slide.title == title) {
                slide.selected = true;
              } else {
                slide.selected = false;
              }
            });
          };
          $scope.select = function (slide) {
            angular.forEach(slides, function (slide) {
              slide.selected = false;
            });
            slide.selected = true;
          };
          this.addSlide = function (slide) {
            slides.push(slide);
          };
        }
      ],
      link: function ($scope, $elm, $attr) {
        var slideOut = function (callback) {
          var width = $('.sidebar').width();
          $($elm).css('right', width + 'px');
          $($elm).css('width', width + 'px');
          $('.container').addClass('adjust');
          $('.contact-desc').addClass('active');
        };
        var width = $('.sidebar').width();
        $($elm).css('width', width + 'px');
        var slideIn = function (callback) {
          $($elm).css('right', '0px');
          $('.container').removeClass('adjust');
          $('.contact-desc').removeClass('active');
        };
        $scope.$watch('selectedItem', function (newValue, oldValue) {
          if (newValue === false) {
            slideIn();
          } else {
            if (!newValue.selected) {
              slideIn();
            } else {
              if (newValue.stop) {
                $scope.selectByTitle('Line');
                $scope.showDetails = true;
              } else {
                $scope.showDetails = false;
                $scope.selectByTitle(newValue.title);
              }
              slideOut();
            }
          }
        });
        $scope.$watch('selectedLine', function (newValue, oldValue) {
          if (newValue) {
            slideOut();
            $scope.selectByTitle('Line');
            if ($scope.selectedStop != null) {
              $scope.showDetails = true;
            }
          }
        });
      },
      replace: true
    };
  }
]);
'use strict';
angular.module('uiModule').directive('slideshow', [function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: { images: '=images' },
      link: function (scope, element, attr) {
        scope.$watch('images', function (newValue, oldValue) {
          if (newValue) {
            scope.theImage = newValue[0];
          }
        });
      },
      template: '<div class="images-box slideshow" ng-transclude>' + '<h3>Photos</h3>' + '<div class="slideshow-content">' + '<div class="main-img"><img src="{{theImage}}"></img></div>' + '<ul class="sub-image">' + '<li ng-repeat="img in images" >' + '<div class="image-group">' + '<img ng-show="theImage != img" src="{{img}}"></img>' + '</div>' + '</li>' + '</ul>' + '</div>' + '</div>',
      replace: true
    };
  }]);
angular.module('trainguideServices').factory('CommonAppState', [
  '$rootScope',
  function ($rootScope) {
    var commonAppService = {};
    commonAppService.selectedStop = {};
    commonAppService.selectedLine = {};
    commonAppService.prepForBroadcast = function (property, msg) {
      console.log('Preparing for broadcast: ' + property);
      this[property] = msg;
      this.broadcastItem(property);
    };
    commonAppService.broadcastItem = function (property) {
      $rootScope.$broadcast('handleBroadcast[' + property + ']');
    };
    return commonAppService;
  }
]);
angular.module('trainguideServices').factory('LinesService', [
  '$http',
  function ($http) {
    var LinesService = {};
    LinesService.getLines = function (callback, err) {
      $http({
        method: 'GET',
        url: 'data/lines.data.json'
      }).success(function (data, status) {
        callback(data, status);
      }).error(function (data, status, headers, config) {
        err(data, status, headers, config);
      });
    };
    return LinesService;
  }
]);
angular.module('trainguideServices').factory('PlacesService', [
  '$http',
  function ($http) {
    var PlacesService = {};
    PlacesService.categories = [
      { name: 'Dining' },
      { name: 'Entertainment' },
      { name: 'Government Building' },
      {
        name: 'Hospital',
        icon: 'icon-hospital'
      },
      {
        name: 'Hotel',
        icon: 'icon-hotel'
      },
      {
        name: 'Office',
        icon: 'icon-office'
      },
      { name: 'Religion' },
      { name: 'Residential' },
      { name: 'School' },
      { name: 'Service' },
      {
        name: 'Shopping',
        icon: 'icon-shopping'
      },
      {
        name: 'Sightseeing',
        icon: 'icon-sights'
      },
      { name: 'Sports' },
      { name: 'Transport Terminal' }
    ];
    PlacesService.activeCategories = function () {
      var result = [];
      for (var i in PlacesService.categories) {
        if (PlacesService.categories[i].icon)
          result.push(PlacesService.categories[i]);
      }
      return result;
    };
    PlacesService.getPlacesByCategory = function (category, callback, err) {
      $http({
        method: 'GET',
        url: '/places/search-place/?queryStr=' + category + '&format=json'
      }).success(function (data, status) {
        callback(data, status);
      }).error(function (data, status, headers, config) {
        err(data, status, headers, config);
      });
    };
    PlacesService.getPlacesByLimitedCategory = function (category, stopname, start, limit, callback, err) {
      $http({
        method: 'GET',
        url: '/places/paginate-place/?category=' + category + '&stopname=' + stopname + '&start=' + start + '&limit=' + limit
      }).success(function (data, status) {
        callback(data, status);
      }).error(function (data, status, headers, config) {
        err(data, status, headers, config);
      });
    };
    return PlacesService;
  }
]);
$(document).ready(function () {
  console.log('get_place loaded!!!');
  $('#search-form').submit(function (evt) {
    evt.preventDefault();
    var query = $('.search-input').val();
    var search = $('#search-div');
    console.log('val: ', query);
    $.ajax({
      type: 'GET',
      url: '/places/search-place',
      data: { queryStr: query }
    }).done(function (msg) {
      console.log('SEARCH OK ', msg);
      search.html(msg);
      util.clickDelete();
    }).fail(function (msg) {
      console.log('SEARCH NOT OK ', msg);
    });
  });
});
$(document).ready(function () {
  console.log('paginate_page loaded!!!');
  var limit = 5;
  var counter = 1;
  var btnDiv = $('#load-btn').parent();
  var btn = '<a href="#" class="button" id="load-btn">Load more...</a>';
  var categoryElem = $('#category');
  var selected = '';
  categoryElem.change(function (evt) {
    selected = categoryElem.find('#catkey:selected').val();
    loadPlaces(selected, 0);
  });
  var clickLoad = function () {
    $('#load-btn').click(function (evt) {
      console.log(counter);
      evt.preventDefault();
      loadPlaces(selected, counter * limit);
      counter++;
    });
  };
  var loadPlaces = function (selectedCategory, start) {
    var morePlaces = '';
    btnDiv.html('<h3>Loading...</h3>');
    $.ajax({
      type: 'GET',
      url: '/places/paginate-place',
      data: {
        limit: limit,
        start: start,
        category: selectedCategory
      }
    }).done(function (msg) {
      console.log('PAGINATE OK: ', msg);
      if (msg.length > 0) {
        for (var i = 0; i < msg.length; i++) {
          var place = msg[i];
          morePlaces += '<tr><td>' + place.name + '</td>' + '<td>' + place.line.name + '-' + place.stop.name + '</td>' + '<td>' + place.distance + '</td>' + '<td><a href="' + place.website + '">' + place.website + '</a></td>' + '<td><a href="' + place.map + '"><img src="/images/map.png"/></a></td>' + '<td>' + place.coordinates.lng + ',' + place.coordinates.lat + '</td>' + '<td>' + place.category + '</td>' + '<td>' + place.subcategory + '</td>' + '<td>' + '<a href="/places/' + place._id + '" class="button">Show</a>' + '<a href="/places/' + place._id + '/edit" class="button">Edit</a>' + '<a href="/places/' + place._id + '/delete" class="button delete-place">Delete</a>' + '</td></tr>';
        }
        $('#no-data').remove();
        $('#place-tbl tbody').append(morePlaces);
        btnDiv.html(btn).on('click', clickLoad());
        util.clickDelete();
      } else {
        $('#place-tbl tbody').html('<tr id="no-data"><td colspan="9">No Data</td>/tr>');
        btnDiv.html('');
      }
    }).fail(function (msg) {
      console.log('PAGINATE NOT OK: ', msg);
      $('#place-tbl tbody').append('<tr id="no-data"><td colspan="9">No More Data</td>/tr>');
      btnDiv.html('');
    });
  };
});
var util = {};
util.clickDelete = function () {
  $('.delete-place').on('click', function (evt) {
    evt.preventDefault();
    if (confirm('Are you sure?')) {
      var elm = $(this);
      var form = $('<form></form>');
      form.attr({
        method: 'POST',
        action: elm.attr('href')
      }).hide().append('<input type="hidden" />').find('input').attr({
        'name': '_method',
        'value': 'delete'
      }).end().submit();
    }
  });
};
$(document).ready(function () {
  console.log('populate_preview loaded!');
  console.log('method', formMethod, 'action', formAction);
  $('#input-place').submit(function (evt) {
    evt.preventDefault();
    var previewElem = $('#preview-div');
    var placeArray = $(this).serializeArray();
    var place = {};
    for (input in placeArray) {
      place[placeArray[input].name] = placeArray[input].value;
    }
    $.ajax({
      type: 'POST',
      url: '/places/preview',
      data: {
        place: place,
        formMethod: formMethod,
        formAction: formAction
      }
    }).done(function (msg) {
      console.log('PREVIEW OK ', msg);
      previewElem.html(msg);
      cancelClick();
    }).fail(function (msg) {
      console.log('PREVIEW NOT OK ', msg);
    });
  });
  var cancelClick = function () {
    $('#cancel').click(function (evt) {
      evt.preventDefault();
      $('#preview-div').html('');
    });
  };
});
$(document).ready(function () {
  console.log('populate_stops loaded!');
  var stationElem = $('#line');
  var stopElem = stationElem.parent().find('span');
  stationElem.change(function (evt) {
    var selected = stationElem.find('#stnkey:selected').val();
    populateStops(selected);
  });
  var populateStops = function (selectedLine) {
    var previewBtn = $('#preview');
    previewBtn.attr('disabled', 'disabled').val('Loading stops...');
    $.ajax({
      type: 'GET',
      url: '/places/station-stops',
      data: { selectedStn: selectedLine }
    }).done(function (msg) {
      console.log('POPULATE OK ', msg);
      var selectStr = '<select name="stop" id="stop" required>' + '<option value="">-- Select Stop-- </option>';
      for (var i = 0; i < msg.length; i++) {
        var selected = '';
        if (window.selectedStop && window.selectedStop == msg[i].name) {
          selected = 'selected';
        }
        selectStr += '<option id="val" value="' + msg[i].stop_id + '" ' + selected + '>' + msg[i].name + '</option>';
      }
      selectStr += '</select>';
      stopElem.html(selectStr);
      previewBtn.removeAttr('disabled').val('Preview');
    }).fail(function (msg) {
      console.log('POPULATE NOT OK ', msg);
    });
  };
  if (window.selectedStop) {
    console.log('Searching for...', window.selectedLineId);
    populateStops(window.selectedLineId);
  }
});