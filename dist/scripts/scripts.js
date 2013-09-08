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
angular.module('trainguide.controllers').controller('DirectionCtrl', [
  '$scope',
  'DirectionsService',
  'StopsService',
  function ($scope, DirectionsService, StopsService) {
<<<<<<< HEAD
    $scope.direction = {};
    $scope.direction.from = null;
    $scope.direction.to = null;
=======
    angular.extend($scope, {
      direction: {
        from: null,
        to: null
      }
    });
>>>>>>> master
    $scope.getDirections = function () {
      DirectionsService.getDirections({
        from: $scope.direction.from,
        to: $scope.direction.to
      }, function (data) {
      }, function () {
      });
    };
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
      markers: [],
      refresh: true,
      pathsProperty: [],
      stopMarkersProperty: []
    });
    function createMarker(val, icon, label) {
      for (var i = 0; i < $scope.markers.length; i++) {
        if ($scope.markers[i].longitude == val.coordinates.lng && $scope.markers[i].latitude == val.coordinates.lat) {
          $scope.markers.splice(i, 1);
          break;
        }
      }
      console.log('icon: ' + icon);
      $scope.markers.push({
        longitude: val.coordinates.lng,
        latitude: val.coordinates.lat,
        icon: icon,
        infoWindow: '<div id="content">' + label + '</div><div class="arrow-up"></div>',
        label: label
      });
    }
    function getColor() {
      switch ($scope.selected.line.name) {
      case 'PNR':
        return 'O';
      case 'LRT1':
        return 'Y';
      case 'LRT2':
        return 'P';
      case 'MRT':
        return 'B';
      }
    }
    $scope.$watch('selected.stop', function (newValue) {
      if (newValue) {
        $scope.markers = [];
      }
    });
    $scope.$watch('selected.sights.data', function (newValue) {
      if (newValue) {
        angular.forEach($scope.selected.sights.data, function (val) {
          createMarker(val, 'images/marker_sights' + getColor() + '.png', val.name);
        });
      }
    }, true);
    $scope.$watch('selected.shops.data', function (newValue) {
      if (newValue) {
        angular.forEach($scope.selected.shops.data, function (val) {
          createMarker(val, 'images/marker_shopping' + getColor() + '.png', val.name);
        });
      }
    }, true);
  }
]);
angular.module('trainguide.controllers').controller('MainCtrl', [
  '$scope',
  '$http',
  '$route',
  'LinesService',
  'StopsService',
  'TransfersService',
  'PlacesService',
  'CommonAppState',
  function ($scope, $http, $route, LinesService, StopsService, TransfersService, PlacesService, CommonAppState) {
<<<<<<< HEAD
    $scope.resultPlaces = [];
    $scope.showDetails = false;
    $scope.selected = {
      stop: null,
      line: null,
      sights: null,
      shops: null
    };
=======
    angular.extend($scope, {
      clickedLatitudeProperty: 11,
      clickedLongitudeProperty: 44,
      showDetails: false,
      selected: {
        stop: null,
        line: null,
        sights: {
          counter: 0,
          data: []
        },
        shops: {
          counter: 0,
          data: []
        }
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
          title: 'Download',
          selected: false
        },
        {
          title: 'Tips',
          selected: false
        }
      ],
      selectedItem: false
    });
>>>>>>> master
    $scope.$watch('selected.stop', function (newValue) {
      if (newValue) {
        $scope.menuItems[0].selected = false;
        $scope.selectedItemHandler($scope.menuItems[0]);
        reloadStopsPlaces();
      }
    });
    $scope.selectedItemHandler = function (item) {
      for (var i in $scope.menuItems) {
        if ($scope.menuItems[i].title == item.title) {
          $scope.menuItems[i].selected = !$scope.menuItems[i].selected;
          if ($scope.menuItems[i].selected) {
            if (item.title == 'Line' && !$scope.selected.line) {
              $scope.selected.line = $scope.lines.LRT1;
              $scope.showDetails = false;
              $scope.getLineDetails($scope.selected.line);
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
<<<<<<< HEAD
    LinesService.getLines(function (data, status) {
      $scope.lines = data;
      for (key in data) {
        $scope.lines[key].name = key;
      }
      $scope.lines.LRT1.color = '#fdc33c';
      $scope.lines.LRT2.color = '#ad86bc';
      $scope.lines.MRT.color = '#5384c4';
      $scope.lines.PNR.color = '#f28740';
      StopsService.setLines($scope.lines);
      TransfersService.getAllTransfers(function (data) {
        $scope.transfers = data;
        for (var i = 0; i < $scope.transfers.length; i++) {
          var fromStop = StopsService.getStopById($scope.transfers[i].from_stop_id);
          var toStop = StopsService.getStopById($scope.transfers[i].to_stop_id);
          fromStop.transfer = {
            line_name: toStop.line_name,
            stop_id: toStop.details.stop_id,
            stop_name: toStop.details.stop_name,
            stop_lon: toStop.details.stop_lon,
            stop_lat: toStop.details.stop_lat
          };
        }
        ;
      }, function (data, status, headers, config) {
        console.log('Error!', data, status, headers, config);
      });
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
=======
    $scope.getLineByName = function (name) {
      for (var i in $scope.lines) {
        console.log('i', i, 'name', name);
        if (i == name) {
          return $scope.lines[i];
        }
      }
      return null;
    };
>>>>>>> master
    $scope.getLineDetails = function (line) {
      $http({
        method: 'GET',
        url: '/api/details/' + line.route_id
      }).success(function (data) {
        $scope.selected.line.details = data;
      }).error(function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
    $scope.getPlaces = function (qry) {
      PlacesService.getPlacesBySearch(qry.queryStr, function (data) {
        if (qry.category == 'Sightseeing') {
          $scope.selected.sights.totalcount = data.places.length;
        }
        if (qry.category == 'Shopping') {
          $scope.selected.shops.totalcount = data.places.length;
        }
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
    $scope.getLimitedPlaces = function (qry) {
      PlacesService.getPlacesByLimitedCategory(qry.category, qry.stopname, qry.start, qry.limit, function (data) {
<<<<<<< HEAD
        for (var item in data) {
          if (qry.category == 'Sightseeing') {
            $scope.selected.sights.push(data[item]);
          }
          if (qry.category == 'Shopping') {
            $scope.selected.shops.push(data[item]);
          }
=======
        console.log('Get places done: ');
        console.log(data);
        if (qry.category == 'Sightseeing') {
          $scope.selected.sights.counter = qry.start;
          Array.prototype.push.apply($scope.selected.sights.data, data);
        } else if (qry.category == 'Shopping') {
          $scope.selected.shops.counter = qry.start;
          Array.prototype.push.apply($scope.selected.shops.data, data);
>>>>>>> master
        }
        console.log($scope.selected);
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
<<<<<<< HEAD
    $scope.searchFn = function (qry) {
      $scope.resultPlaces = [];
      PlacesService.getPlacesBySearch(qry.queryStr, function (data) {
        var places = data.places;
        for (var i = 0; i < places.length; i++) {
          for (key in $scope.lines) {
            if ($scope.lines[key].shortName == places[i].line.name) {
              places[i].line.line_name = $scope.lines[key].name;
            }
          }
          $scope.resultPlaces.push(places[i]);
        }
        console.log('$scope.resultPlaces' + qry.queryStr, $scope.resultPlaces);
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!' + qry.queryStr, data, status, config);
      });
    };
=======
    function reloadStopsPlaces() {
      var limit = 5;
      var counter = 0;
      $scope.selected.sights.data = [];
      console.log('Getting stop name: ');
      var stopname = $scope.selected.stop.details.stop_name;
      console.log(stopname);
      $scope.getLimitedPlaces({
        limit: limit,
        start: counter * limit,
        category: 'Shopping',
        stopname: stopname
      });
      $scope.selected.shops.data = [];
      $scope.getLimitedPlaces({
        limit: limit,
        start: counter * limit,
        category: 'Sightseeing',
        stopname: stopname
      });
    }
    function initialize() {
      LinesService.getLines(function (data, status) {
        $scope.lines = data;
        for (key in data) {
          $scope.lines[key].name = key;
        }
        $scope.lines.LRT1.color = '#fdc33c';
        $scope.lines.LRT2.color = '#ad86bc';
        $scope.lines.MRT.color = '#5384c4';
        $scope.lines.PNR.color = '#f28740';
        StopsService.setLines($scope.lines);
        TransfersService.getAllTransfers(function (data) {
          $scope.transfers = data;
          for (var i = 0; i < $scope.transfers.length; i++) {
            var fromStop = StopsService.getStopById($scope.transfers[i].from_stop_id);
            var toStop = StopsService.getStopById($scope.transfers[i].to_stop_id);
            fromStop.transfer = {
              line_name: toStop.line_name,
              stop_id: toStop.details.stop_id,
              stop_name: toStop.details.stop_name,
              stop_lon: toStop.details.stop_lon,
              stop_lat: toStop.details.stop_lat
            };
          }
          ;
        }, function (data, status, headers, config) {
          console.log('Error!', data, status, headers, config);
        });
      });
    }
    initialize();
>>>>>>> master
  }
]);
angular.module('trainguide.controllers').controller('PlaceCtrl', [
  '$scope',
  '$http',
  'LinesService',
  'PlacesService',
  function ($scope, $http, LinesService, PlacesService) {
    $scope.places = [];
    $scope.resultPlaces = [];
    $scope.searchStr = null;
    $scope.activeCategories = PlacesService.activeCategories();
    $scope.selected = { category: $scope.activeCategories[0].name };
    $scope.getPlaces = function (qry) {
<<<<<<< HEAD
      PlacesService.getPlacesBySearch(qry.queryStr, function (data) {
=======
      PlacesService.getPlacesBySearch(qry.category, qry.queryStr, function (data) {
>>>>>>> master
        $scope.places.totalcount = data.places.length;
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
    $scope.getLimitedPlaces = function (qry) {
      PlacesService.getPlacesByLimitedCategory(qry.category, qry.stopname, qry.start, qry.limit, function (data) {
        for (var item in data) {
          for (key in $scope.lines) {
            if ($scope.lines[key].shortName == data[item].line.name) {
              data[item].line.line_name = $scope.lines[key].name;
            }
          }
          $scope.places.push(data[item]);
        }
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
    $scope.searchFn = function (qry) {
      $scope.resultPlaces = [];
      PlacesService.getPlacesBySearch(qry.category, qry.queryStr, function (data) {
        var places = data.places;
        for (var i = 0; i < places.length; i++) {
          for (key in $scope.lines) {
            if ($scope.lines[key].shortName == places[i].line.name) {
              places[i].line.line_name = $scope.lines[key].name;
            }
          }
          $scope.resultPlaces.push(places[i]);
        }
        console.log('$scope.resultPlaces' + qry.queryStr, $scope.resultPlaces);
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!' + qry.queryStr, data, status, config);
      });
    };
  }
]);
angular.module('google-maps').directive('globalizeMap', [
  '$rootScope',
  function ($rootScope) {
    return {
      require: '^googleMap',
      restrict: 'E',
      link: function (scope, elm, attrs, gmapCtrl) {
        gmapCtrl.registerMapListener(scope);
        scope.onMapReady = function (map) {
          console.log('Attach \'map\' to $rootScope');
          $rootScope.map = map;
        };
      }
    };
  }
]);
angular.module('google-maps').directive('globalizeMap', [
  '$rootScope',
  function ($rootScope) {
    return {
      require: '^googleMap',
      restrict: 'E',
      link: function (scope, elm, attrs, gmapCtrl) {
        gmapCtrl.registerMapListener(scope);
        scope.onMapReady = function (map) {
          console.log('Attach \'map\' to $rootScope');
          $rootScope.map = map;
        };
      }
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
angular.module('google-maps').directive('placesAutocomplete', [
  '$rootScope',
  function ($rootScope) {
    return {
      restrict: 'A',
<<<<<<< HEAD
      scope: {},
=======
      scope: { place: '=' },
>>>>>>> master
      link: function (scope, elm, attrs) {
        var autocomplete = new google.maps.places.Autocomplete(elm[0]);
        $rootScope.$watch('map', function (newVal, oldVal) {
          if (newVal) {
<<<<<<< HEAD
            console.log('Map exists!', newVal);
=======
>>>>>>> master
            autocomplete.bindTo('bounds', newVal);
          }
        });
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
<<<<<<< HEAD
=======
          scope.place = place;
>>>>>>> master
        });
      }
    };
  }
]);
'use strict';
angular.module('google-maps').directive('polylineDrawer', [function () {
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
            scope.map.setZoom(16);
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
  }]);
'use strict';
angular.module('uiModule').directive('categories', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      categories: '=',
      selectedCategory: '=',
      searchStr: '=',
      resultPlaces: '='
    },
    link: function (scope, element) {
      scope.$watch('selectedCategory', function (newValue, oldValue) {
        console.log('selectedCategory', newValue);
      });
      scope.setCategory = function (category) {
        scope.selectedCategory = category;
      };
    },
    template: '<div class="categories-list" ng-transclude>' + '<div>' + '<ul>' + '<li ng-show="category.icon" ng-repeat="category in categories" ng-class="{\'selected\': selectedCategory==category.name}">' + '<i class="{{category.icon}}" ng-click="setCategory(category.name)" ng-class="{\'selected\': selectedCategory==category.name}"></i>' + '<div ng-show="selectedCategory==category.name" class="highlight"></div>' + '</li>' + '</ul>' + '</div>' + '<h6 ng-show="resultPlaces.length==0 && (searchStr==null || searchStr==\'\')">Featured</h6>' + '<h6 ng-show="resultPlaces.length>0">Results</h6>' + '<h6 ng-show="resultPlaces.length==0 && searchStr">(no results)</h6>' + '</div>',
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
        lines: '=',
        selectedStop: '=',
        selectedLine: '=',
        showDetails: '=',
        getLineDetails: '='
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
          scope.getLineDetails(line);
        };
      },
      template: '<div class="line-nav clearfix {{selectedLine.name}}" ng-transclude>' + '<ul>' + '<li ng-repeat="i in lines" class="{{i.name}}" ng-class="{active:i.name == selectedLine.name}" ng-click="lineSelected(i)">' + '{{i.shortName}}' + '</li>' + '</ul>' + '<div class="stop-desc" ng-class="{true:\'showdetails\', false:\'nodetails\'}[showDetails]"></div>' + '<table class="line-desc" ng-class="{true:\'nodetails\', false:\'showdetails\'}[showDetails]">' + '<tr>' + '<td>Weekdays: {{selectedLine.details.weekdays}}</td>' + '</tr>' + '<tr>' + '<td>Weekend: {{selectedLine.details.weekend}}</td>' + '</tr>' + '<tr>' + '<td>Stored Value Card: {{selectedLine.details.svc}}</td>' + '</tr>' + '</table>' + '<table class="contact-desc" ng-class="{true:\'nodetails\', false:\'showdetails\'}[showDetails]">' + '<th>Contact</th>' + '<tr>' + '<td>Web: {{selectedLine.details.web}}</td>' + '</tr>' + '<tr>' + '<td>Twitter: {{selectedLine.details.twitter}}</td>' + '</tr>' + '<tr>' + '<td>Contact No.: {{selectedLine.details.contactNo}}</td>' + '</tr>' + '<tr>' + '<td>Fare: {{selectedLine.details.fare}}</td>' + '</tr>' + '<tr>' + '<td>Email: {{selectedLine.details.email}}</td>' + '</tr>' + '</table>' + '</div>',
      replace: true
    };
  }
]);
'use strict';
angular.module('uiModule').directive('lineStops', [
  'CommonAppState',
  'StopsService',
  function (CommonAppState, StopsService) {
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
            svg.selectAll('.transfer').remove();
            console.log('svgHeight', svgHeight, 'linestops: ', newValue.stops);
            y = d3.scale.linear().domain([
              0,
              newValue.stops.length - 1
            ]).range([
              0,
              svgHeight - 30
            ]);
            for (var i in newValue.stops) {
              svg.selectAll('.vertical').attr('height', svgHeight - 30).attr('class', 'vertical ' + newValue.name);
              var dots = svg.selectAll('.stop').data(newValue.stops, function (d) {
                  return d.stop_id;
                });
              dots.enter().append('circle').attr('class', function (d, i) {
                var _class = 'stop ';
                if (d.transfer) {
                  svg.append('rect').attr('class', 'transfer ' + d.transfer.line_name).attr('x', centerX + 9).attr('y', y(i) + 15).attr('width', 20).attr('height', 10).attr('fill', '#333');
                  svg.append('circle').attr('class', 'transfer ' + d.transfer.line_name).attr('cx', centerX + 25).attr('cy', y(i) + 20).attr('r', 8).on('click', function () {
                    scope.onSelectedStop(StopsService.getStopById(d.transfer.stop_id));
                  });
                  return _class += 'transferee';
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
                  var names = d.transfer.stop_name.split(' ');
                  svg.append('text').attr('class', 'transfer').attr('x', centerX + 40).attr('y', y(i) + 23).text(function () {
                    return names[0].toUpperCase() + ' ' + names[1].toUpperCase();
                  });
                  if (names.length > 1) {
                    if (names[2]) {
                      svg.append('text').attr('class', 'transfer').attr('x', centerX + 40).attr('y', y(i) + 33).text(function () {
                        return names[2].toUpperCase();
                      });
                    }
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
      searchStr: '=',
      getPlacesCount: '=',
      onQueryPlaces: '=',
      places: '=',
<<<<<<< HEAD
      resultPlaces: '='
=======
      resultPlaces: '=',
      onSearch: '='
>>>>>>> master
    },
    link: function (scope, element) {
      var query = {};
      scope.$watch('searchStr', function (newValue, oldValue) {
        if (newValue || newValue === '') {
          scope.resultPlaces = [];
          scope.loadPlaces(0, scope.selectedCategory);
        }
      });
      scope.$watch('selectedCategory', function (newValue, oldValue) {
        query.queryStr = newValue;
        query.category = newValue;
        if (newValue) {
          scope.places = [];
          scope.resultPlaces = [];
          scope.counter = 0;
          scope.loadPlaces(0, newValue);
          scope.getPlacesCount(query);
        }
      });
      var limit = 20;
      scope.loadPlaces = function (counter, selectedCategory) {
        if (scope.searchStr) {
          var qry = {
              category: selectedCategory,
              queryStr: scope.searchStr
            };
          scope.onSearch(qry);
        } else {
          var qry = {
              limit: limit,
              start: counter * limit,
              category: selectedCategory,
              stopname: ''
            };
          scope.onQueryPlaces(qry);
        }
        $('.antiscroll-wrap').antiscroll();
      };
    },
    template: '<div>' + '<div class="antiscroll-wrap">' + '<div class="block">' + '<div class="antiscroll-inner">' + '<div ng-show="resultPlaces.length==0" class="places-list" ng-transclude>' + '<ul>' + '<li ng-repeat="place in places">' + '<span class="name">{{place.name}}</span>' + '<span class="dist">{{place.distance}}</span>' + '<div class="{{place.line.line_name}} square"></div>' + '</li>' + '</ul>' + '</div>' + '<div ng-show="resultPlaces.length>0" class="places-list" ng-transclude>' + '<ul>' + '<li ng-repeat="resultPlace in resultPlaces">' + '<span class="name">{{resultPlace.name}}</span>' + '<span class="dist">{{resultPlace.distance}}</span>' + '<div class="{{resultPlace.line.line_name}} square"></div>' + '</li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a ng-show="resultPlaces==0 && counter*20<=places.totalcount-20" ng-click="loadPlaces(counter=counter+1, selectedCategory)">Load more...</a>' + '</div>',
    replace: true
  };
});
'use strict';
angular.module('uiModule').directive('placesbox', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@',
      icon: '@',
      onQueryPlaces: '=',
      places: '=',
      category: '=',
      stopname: '='
    },
    link: function (scope, element, attr) {
      var limit = 5;
      scope.$watch('places', function () {
        console.log('Places value: ', scope.places);
      }, true);
      scope.loadPlaces = function (counter) {
        var qry = {
            limit: limit,
            start: counter * limit,
            category: scope.category,
            stopname: scope.stopname
          };
        console.log('shops qry', qry);
        scope.onQueryPlaces(qry);
        $('.antiscroll-wrap').antiscroll();
      };
    },
<<<<<<< HEAD
    template: '<div>' + '<div class="antiscroll-wrap">' + '<div class="block">' + '<div class="antiscroll-inner">' + '<div ng-show="resultPlaces.length==0" class="places-list" ng-transclude>' + '<ul>' + '<li ng-repeat="place in places">' + '<span class="name">{{place.name}}</span>' + '<span class="dist">{{place.distance}}</span>' + '<div class="{{place.line.line_name}} square"></div>' + '</li>' + '</ul>' + '</div>' + '<div ng-show="resultPlaces.length>0" class="places-list" ng-transclude>' + '<ul>' + '<li ng-repeat="resultPlace in resultPlaces">' + '<span class="name">{{resultPlace.name}}</span>' + '<span class="dist">{{resultPlace.distance}}</span>' + '<div class="{{resultPlace.line.line_name}} square"></div>' + '</li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a ng-show="((resultPlaces.length==0)&&(counter*20<=places.totalcount-20))" ng-click="loadPlaces(counter=counter+1, selectedCategory)">Load more...</a>' + '</div>',
=======
    template: '<div class="sights-box">' + '<div><h3>{{title}}</h3><i class="{{icon}}"></i></div>' + '<ul>' + '<li ng-repeat="place in places.data">' + '<div>' + '<span class="name">{{place.name}}</span>' + '<span class="distance">{{place.distance}}</span>' + '</div>' + '</li>' + '<li ng-show="!places.data.length">No sights near the area.</li>' + '</ul>' + '<a ng-show="places.counter*5<=places.totalcount-5" ng-click="loadPlaces(places.counter+1)">More...</a>' + '</div>',
>>>>>>> master
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
angular.module('uiModule').directive('search', function () {
<<<<<<< HEAD
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      onSearch: '=',
      resultPlaces: '='
    },
    link: function (scope, element) {
      var KEYS = { ENTER: 13 };
      $('.search-box').focus(function () {
        $(this).animate({ width: '200px' }, 'fast');
        $('h2.place').hide('fast');
        $('h2.place span').hide('fast');
      }).blur(function () {
        $(this).animate({ width: '100px' }, 'fast');
        $('h2.place').show('fast');
        $('h2.place span').show('fast');
      }).keyup(function (evt) {
        if (evt.keyCode === KEYS.ENTER) {
          var qry = { queryStr: $(this).val() };
          if ($(this).val() != '' || $(this).val() != this.value) {
            $('.categories-list h6').text('Results');
            scope.onSearch(qry);
          } else {
            $('.categories-list h6').text('Featured');
            scope.resultPlaces = [];
            scope.$apply();
          }
        }
      });
    },
    template: '<div>' + '<h2 class="place">Places <span> to go</span></h2>' + '<div class="search-form">' + '<i class="icon-search"></i>' + '<input type="text" placeholder="Search" class="search-box">' + '</div>' + '</div>',
    replace: true
  };
});
'use strict';
angular.module('uiModule').directive('shopsSlide', function () {
=======
>>>>>>> master
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      selectedCategory: '=',
      searchStr: '=',
      onSearch: '=',
      resultPlaces: '='
    },
    link: function (scope, element) {
      var KEYS = { ENTER: 13 };
      scope.$watch('selectedCategory', function (newValue, oldValue) {
        $('.search-box').focus(function () {
          $(this).animate({ width: '200px' }, 'fast');
          $('h2.place').hide('fast');
          $('h2.place span').hide('fast');
        }).blur(function () {
          $(this).animate({ width: '100px' }, 'fast');
          $('h2.place').show('fast');
          $('h2.place span').show('fast');
        }).keyup(function (evt) {
          if (evt.keyCode === KEYS.ENTER) {
            scope.searchStr = $(this).val();
            scope.$apply();
          }
        });
      });
    },
    template: '<div>' + '<h2 class="place">Places <span> to go</span></h2>' + '<div class="search-form">' + '<i class="icon-search"></i>' + '<input type="text" placeholder="Search" class="search-box">' + '</div>' + '</div>',
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
angular.module('trainguideServices').factory('DirectionsService', [
  '$http',
  function ($http) {
    var DirectionsService = {};
    var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';
    DirectionsService.getDirections = function (query, callback, err) {
<<<<<<< HEAD
=======
      var from = query.from.geometry.location;
      var to = query.to.geometry.location;
      var url = api + '/plan?fromPlace=' + from.ob + ',' + from.pb + '&toPlace=' + to.ob + ',' + to.pb + '&callback=JSON_CALLBACK';
      console.log(url);
      $http.jsonp(url).success(function (data) {
        console.log(data.plan);
      }).error(function (data, status, headers, config) {
        console.log('Error accessing jsonp');
        console.log(status);
      });
>>>>>>> master
    };
    return DirectionsService;
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
<<<<<<< HEAD
    PlacesService.getPlacesBySearch = function (query, callback, err) {
      $http({
        method: 'GET',
        url: '/places/search-place/?queryStr=' + query + '&format=json'
=======
    PlacesService.getPlacesBySearch = function (category, query, callback, err) {
      $http({
        method: 'GET',
        url: '/places/search-place/?category=' + category + '&queryStr=' + query + '&format=json'
>>>>>>> master
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
angular.module('trainguideServices').factory('StopsService', function () {
  var StopsService = {};
  var _lines = null;
  StopsService.setLines = function (lines) {
    _lines = lines;
  };
  StopsService.getStopById = function (stopId) {
    for (key in _lines) {
      var stops = _lines[key].stops;
      for (var i = 0; i < stops.length; i++) {
        if (stops[i].stop_id == stopId) {
          stops[i].line_name = _lines[key].name;
          return stops[i];
        }
      }
      ;
    }
  };
  return StopsService;
});
angular.module('trainguideServices').factory('TransfersService', [
  '$http',
  function ($http) {
    var TransfersService = {};
    var _lines = null;
    TransfersService.getAllTransfers = function (callback, err) {
      $http({
        method: 'GET',
        url: '/api/transfers'
      }).success(function (data) {
        callback(data);
      }).error(function (data, status, headers, config) {
        err(data, status, headers, config);
      });
    };
    return TransfersService;
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