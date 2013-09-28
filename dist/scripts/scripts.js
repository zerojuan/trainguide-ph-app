angular.module('trainguide.filters', []);
angular.module('trainguideServices', []);
angular.module('uiModule', ['trainguideServices']);
angular.module('google-maps', ['trainguideServices']);
angular.module('trainguide.controllers', ['trainguideServices']);
angular.module('trainguide', [
  'google-maps',
  'trainguide.filters',
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
    angular.extend($scope, {
      direction: { activeTrip: null },
      plan: null,
      avoidBuses: true,
      loadingQuery: false
    });
    $scope.getDirections = function () {
      $scope.loadingQuery = true;
      DirectionsService.getDirections({
        from: $scope.selected.direction.from,
        to: $scope.selected.direction.to,
        avoidBuses: $scope.avoidBuses
      }, function (data) {
        console.log(data);
        $scope.plan = data;
        $scope.selected.itinerary = $scope.plan.itineraries[0];
        $scope.loadingQuery = false;
        $scope.errorMessage = null;
      }, function (err) {
        console.log('Some error occured', err);
        $scope.loadingQuery = false;
        $scope.errorMessage = err.msg;
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
    function createMarker(val, icon, label, infoWindow) {
      for (var i = 0; i < $scope.markers.length; i++) {
        if ($scope.markers[i].longitude == val.coordinates.lng && $scope.markers[i].latitude == val.coordinates.lat) {
          $scope.markers.splice(i, 1);
          break;
        }
      }
      if (!infoWindow) {
        infoWindow = '<div id="content">' + label + '</div><div class="arrow-up"></div>';
      }
      console.log('icon: ' + icon);
      $scope.markers.push({
        longitude: val.coordinates.lng,
        latitude: val.coordinates.lat,
        icon: icon,
        infoWindow: infoWindow,
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
      console.log('selectedstop!!!', $scope.selected.stop);
      if (newValue) {
        $scope.markers = [];
      }
    });
    $scope.$watch('selected.hospital.data', function (newValue) {
      if (newValue) {
        angular.forEach($scope.selected.hospital.data, function (val) {
          createMarker(val, 'images/marker_medical' + getColor() + '.png', val.name);
        });
      }
    }, true);
    $scope.$watch('selected.hotel.data', function (newValue) {
      if (newValue) {
        angular.forEach($scope.selected.hotel.data, function (val) {
          createMarker(val, 'images/marker_hotel' + getColor() + '.png', val.name);
        });
      }
    }, true);
    $scope.$watch('selected.office.data', function (newValue) {
      if (newValue) {
        angular.forEach($scope.selected.office.data, function (val) {
          createMarker(val, 'images/marker_office' + getColor() + '.png', val.name);
        });
      }
    }, true);
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
    $scope.$watch('selected.nearbyStops', function (newValue) {
      if (newValue) {
        console.log('Heyo: ', $scope.selected.nearbyStops);
        angular.forEach($scope.selected.nearbyStops, function (val) {
          createMarker({
            coordinates: {
              lat: val.stopLat,
              lng: val.stopLon
            }
          }, 'images/marker_transit' + getColor() + '.png', val.stopName);
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
  'FaresService',
  'PlacesService',
  'CommonAppState',
  'DirectionsService',
  function ($scope, $http, $route, LinesService, StopsService, TransfersService, FaresService, PlacesService, CommonAppState, DirectionsService) {
    angular.extend($scope, {
      clickedLatitudeProperty: 11,
      clickedLongitudeProperty: 44,
      showDetails: false,
      selected: {
        stop: null,
        line: null,
        dest: null,
        nearbyStops: null,
        hospital: {
          counter: 0,
          data: []
        },
        hotel: {
          counter: 0,
          data: []
        },
        office: {
          counter: 0,
          data: []
        },
        sights: {
          counter: 0,
          data: []
        },
        shops: {
          counter: 0,
          data: []
        },
        direction: {
          to: null,
          from: null
        },
        isSearch: {
          to: false,
          from: false
        },
        itinerary: null
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
          title: 'Tips',
          selected: false
        },
        {
          title: 'Download',
          selected: false
        }
      ],
      selectedItem: false,
      tips: [
        {
          title: 'Ticketing',
          selected: true,
          details: [
            'The MRT and LRT use magnetic cards that are bought at ticket windows. Both single journey tickets and Stored Value Tickets (SVT) worth 100 Pesos can be bought.',
            'Simply slip the card into the turnstile slot and pass through. SVTs deduct the right amount once you exit from the station and give you a "bonus ride" which means any amount left (from .50) entitles you to one last ride.',
            'The PNR uses traditional paper tickets, bought at a ticket booth in each station.'
          ],
          image: '/images/logo_card.png'
        },
        {
          title: 'Time',
          selected: false,
          details: [
            'Trains are packed during rush hour (6-8:30AM and 5:30-8PM) so schedule your trips around that time. Weekends are usually less crowded.',
            'In the large stations, ticket lines can take up to 20 minutes of your time, and security checks only make it longer. Get an SVT to skip the ticket line and save time. If SVTs aren\'t available, buy two tickets to your destination, one for going, and one for returning.',
            'PNR trains start running around 5:05, then arrive every 30 min. Arriving a little earlier than scheduled is a good idea. On Sundays the trains run every hour.'
          ],
          image: '/images/logo_time.png'
        },
        {
          title: 'Safety',
          selected: false,
          details: [
            'The train system is generally safe, but petty crime can occur. Security guards man all stations and police have booths at major stations, in case of emergency or for general inquiries.',
            'The first train cars of all the train lines are reserved for women, the elderly, children and the disabled.'
          ],
          image: '/images/logo_safety.png'
        },
        {
          title: 'Airport',
          selected: false,
          details: [
            'There are shuttle buses from EDSA/Taft station to the airport, but their departure times fluctuate.',
            'There are no lines to the airport as of yet, but a spur line to the airport is being explored.',
            'The nearest station to the NAIA1 and 2 is Baclaran station on LRT1. For NAIA3, the nearest station is PNR Nichols. You\'ll still need to take a taxi to the airport from these stations.'
          ],
          image: '/images/logo_airport.png'
        }
      ]
    });
    $scope.$watch('selected.stop', function (newValue) {
      if (newValue) {
        $scope.menuItems[0].selected = false;
        $scope.selectedItemHandler($scope.menuItems[0]);
        DirectionsService.getStopsNearPoint({
          from: {
            lat: $scope.selected.stop.details.stop_lat,
            lon: $scope.selected.stop.details.stop_lon
          }
        }, function (data) {
          $scope.selected.nearbyStops = data;
        }, function (err) {
          console.log('======== Error!');
        });
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
    $scope.getLineByName = function (name) {
      for (var i in $scope.lines) {
        console.log('i', i, 'name', name);
        if (i == name) {
          return $scope.lines[i];
        }
      }
      return null;
    };
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
        if (qry.category == 'Hospital') {
          $scope.selected.hospital.totalcount = data.places.length;
        }
        if (qry.category == 'Hotel') {
          $scope.selected.hotel.totalcount = data.places.length;
        }
        if (qry.category == 'Office') {
          $scope.selected.office.totalcount = data.places.length;
        }
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
        console.log('Get places done: ');
        console.log(data);
        if (qry.category == 'Hospital') {
          $scope.selected.hospital.counter = qry.start;
          $scope.selected.hospital.data = data;
        } else if (qry.category == 'Hotel') {
          $scope.selected.hotel.counter = qry.start;
          $scope.selected.hotel.data = data;
        } else if (qry.category == 'Office') {
          $scope.selected.office.counter = qry.start;
          $scope.selected.office.data = data;
        } else if (qry.category == 'Sightseeing') {
          $scope.selected.sights.counter = qry.start;
          $scope.selected.sights.data = data;
        } else if (qry.category == 'Shopping') {
          $scope.selected.shops.counter = qry.start;
          $scope.selected.shops.data = data;
        }
        console.log($scope.selected);
      }, function (data, status, headers, config) {
        console.log('ERROR!!!!!!', data, status, headers, config);
      });
    };
    $scope.setStop = function (lineName, stopId) {
      var stops = $scope.lines[lineName].stops;
      for (var i in stops) {
        if (stops[i].details._id == stopId) {
          $scope.selected.stop = stops[i];
        }
      }
    };
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
        category: 'Hospital',
        stopname: stopname
      });
      $scope.getLimitedPlaces({
        limit: limit,
        start: counter * limit,
        category: 'Hotel',
        stopname: stopname
      });
      $scope.getLimitedPlaces({
        limit: limit,
        start: counter * limit,
        category: 'Office',
        stopname: stopname
      });
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
        var fareData = {};
        fareData.MRT = $scope.lines.MRT.fare;
        fareData.LRT1 = $scope.lines.LRT1.fare;
        fareData.LRT2 = $scope.lines.LRT2.fare;
        fareData.PNR = $scope.lines.PNR.fare;
        DirectionsService.bindFareMatrix('TRAIN', fareData);
        FaresService.getPUB(function (data) {
          DirectionsService.bindFareMatrix('BUS', data);
        });
        FaresService.getPUJ(function (data) {
          DirectionsService.bindFareMatrix('JEEP', data);
        });
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
      PlacesService.getPlacesBySearch(qry.category, qry.queryStr, function (data) {
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
(function () {
  angular.module('trainguide.filters').filter('realmode', function () {
    return function (mode, routeId) {
      if (mode == 'BUS') {
        if (routeId.indexOf('PUJ') >= 0) {
          return 'JEEP';
        } else {
          return 'BUS';
        }
      } else {
        return mode;
      }
    };
  }).filter('tominutes', function () {
    return function (millis) {
      return Math.round(millis / 1000 / 60);
    };
  }).filter('parseDirection', function () {
    return function (direction) {
      if (direction.indexOf('_')) {
        return direction.replace('_', ' ');
      }
    };
  }).filter('lineCode', function () {
    return function (line) {
      if (line) {
        var code;
        switch (line) {
        case 'LRT 1':
          code = 'LRT1';
          break;
        case 'LRT 2':
          code = 'LRT2';
          break;
        case 'MRT-3':
          code = 'MRT';
          break;
        default:
          code = 'PNR';
          break;
        }
        return code;
      }
    };
  });
}());
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
              disableDefaultUI: true,
              zoomControl: true
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
angular.module('google-maps').directive('itineraryRender', [
  '$rootScope',
  function ($rootScope) {
    return {
      require: '^googleMap',
      restrict: 'E',
      scope: { itinerary: '=' },
      link: function (scope, elm, attrs, ctrl) {
        ctrl.registerMapListener(scope);
        var paths = [];
        scope.onMapReady = function (map) {
          scope.map = map;
        };
        scope.$watch('map', function () {
        });
        function zoomToObject(arr) {
          var bounds = new google.maps.LatLngBounds();
          for (var i in arr) {
            var obj = arr[i];
            var points = obj.getPath().getArray();
            for (var n = 0; n < points.length; n++) {
              bounds.extend(points[n]);
            }
          }
          scope.map.fitBounds(bounds);
        }
        var drawLines = function () {
          angular.forEach(paths, function (v, i) {
            v.setMap(null);
          });
          paths = [];
          for (var legs in scope.itinerary.legs) {
            var leg = scope.itinerary.legs[legs];
            var decodedPath = google.maps.geometry.encoding.decodePath(leg.legGeometry.points);
            var color = '#2BA6CB';
            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 2
              };
            var path = null;
            if (leg.mode == 'WALK') {
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
            } else {
              path = new google.maps.Polyline({
                strokeColor: color,
                strokeOpacity: 0.9,
                strokeWeight: 5,
                path: decodedPath,
                zIndex: 10,
                map: scope.map
              });
            }
            paths.push(path);
          }
          zoomToObject(paths);
        };
        scope.$watch('itinerary', function (newValue, oldValue) {
          if (newValue) {
            console.log('Itenerary changed: ', scope.itinerary);
            drawLines();
          }
        });
      },
      replace: true,
      template: '<div></div>'
    };
  }
]);
'use strict';
angular.module('google-maps').factory('MapDirectionsService', function () {
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
  'MapDirectionsService',
  '$rootScope',
  function (DirectionsService, $rootScope) {
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
          $rootScope.map = map;
          scope.map = map;
        };
        scope.$watch('map', function () {
          DirectionsService.setMap(scope.map);
        });
        scope.$watch('selectedDest', function () {
          console.log('scope.selectedStop && scope.selectedDest!!!', scope.selectedStop, scope.selectedDest);
          if (scope.selectedStop && scope.selectedDest) {
            var start = new google.maps.LatLng(scope.selectedStop.details.stop_lat, scope.selectedStop.details.stop_lon);
            var end = new google.maps.LatLng(scope.selectedDest.coordinates.lat, scope.selectedDest.coordinates.lng);
            DirectionsService.calcRoute(start, end);
          }
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
      scope: { place: '=' },
      link: function (scope, elm, attrs) {
        var autocomplete = new google.maps.places.Autocomplete(elm[0]);
        $rootScope.$watch('map', function (newVal, oldVal) {
          if (newVal) {
            autocomplete.bindTo('bounds', newVal);
          }
        });
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
          scope.place = place;
          scope.$apply();
        });
        scope.$watch('place', function (newVal) {
          console.log('New Place update!', newVal);
          if (newVal)
            elm.val(newVal.formatted_address);
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
angular.module('google-maps').directive('tripAdder', [
  'PlacesService',
  function (PlacesService) {
    return {
      require: '^googleMap',
      restrict: 'E',
      scope: {
        isSearch: '=',
        direction: '='
      },
      link: function (scope, elm, attrs, gmapCtrl) {
        gmapCtrl.registerMapListener(scope);
        var geocoder = new google.maps.Geocoder();
        var fromMarker = null;
        var toMarker = null;
        scope.onMapReady = function (map) {
          scope.map = map;
          google.maps.event.addListener(scope.map, 'click', onClickMap);
        };
        function onClickMap(event) {
          var clickPos = event.latLng;
          if (scope.isSearch.to || scope.isSearch.from) {
            geocoder.geocode({ 'latLng': clickPos }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                console.log(results);
                setPlace(results[0]);
              } else {
                console.log('Geocoder failed: ' + status);
              }
            });
          }
        }
        function setPlace(value) {
          if (scope.isSearch.to) {
            scope.direction.to = value;
            scope.$apply();
          } else if (scope.isSearch.from) {
            scope.direction.from = value;
            scope.$apply();
          }
        }
        function showHideCursor() {
          if (scope.isSearch.to) {
            scope.map.setOptions({ draggableCursor: 'url(images/marker_end.png) 16 16, default' });
          } else if (scope.isSearch.from) {
            scope.map.setOptions({ draggableCursor: 'url(images/marker_start.png) 16 16, default' });
          } else {
            scope.map.setOptions({ draggableCursor: null });
          }
        }
        scope.$watch('isSearch.to', function () {
          showHideCursor();
        });
        scope.$watch('isSearch.from', function () {
          showHideCursor();
        });
        scope.$watch('direction.to', function (newValue) {
          if (!newValue) {
            return;
          }
          if (fromMarker) {
            fromMarker.setMap(null);
          }
          scope.isSearch.to = false;
          fromMarker = new google.maps.Marker({
            position: newValue.geometry.location,
            map: scope.map,
            icon: 'images/marker_end.png'
          });
        });
        scope.$watch('direction.from', function (newValue) {
          if (!newValue) {
            return;
          }
          if (toMarker) {
            toMarker.setMap(null);
          }
          scope.isSearch.from = false;
          toMarker = new google.maps.Marker({
            position: newValue.geometry.location,
            map: scope.map,
            icon: 'images/marker_start.png'
          });
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
    template: '<div class="categories-list" ng-transclude>' + '<div>' + '<ul>' + '<li ng-show="category.icon" ng-repeat="category in categories" ng-class="{\'selected\': selectedCategory==category.name}">' + '<i class="{{category.icon}}" ng-click="setCategory(category.name)" ng-class="{\'selected\': selectedCategory==category.name}"></i>' + '<div ng-show="selectedCategory==category.name" class="highlight"></div>' + '</li>' + '</ul>' + '</div>' + '<h6 ng-show="resultPlaces.length==0 && (searchStr==null || searchStr==\'\')">{{selectedCategory}}</h6>' + '<h6 ng-show="resultPlaces.length>0">Results</h6>' + '<h6 ng-show="resultPlaces.length==0 && searchStr">(no results)</h6>' + '</div>',
    replace: true
  };
});
'use strict';
angular.module('uiModule').directive('direction', [
  '$filter',
  function ($filter) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        leg: '=',
        isLast: '&isLast'
      },
      link: function (scope, elm, attrs) {
        $('.antiscroll-wrap').antiscroll();
        scope.selectedStep = null;
        scope.divClass = 'align';
        scope.trueMode = $filter('realmode')(scope.leg.mode, scope.leg.routeId);
        scope.showMe = scope.trueMode == 'WALK' || scope.trueMode == 'RAIL';
        scope.routeCode = $filter('lineCode')(scope.leg.route);
        if (!scope.isLast()) {
          scope.divClass = scope.trueMode;
          if (scope.trueMode == 'RAIL')
            scope.divClass += ' ' + scope.routeCode;
        }
        scope.clickedDirection = function (leg) {
          scope.selectedStep = scope.selectedStep == null ? leg : null;
        };
      },
      template: '<div>' + '<div class="{{divClass}}" ng-class="{clickable: trueMode!=\'RAIL\'}" ng-click="clickedDirection(leg)">' + '<div class="{{trueMode}} circle {{routeCode}}"></div>' + '<p>{{trueMode}} <span style="font-size: 10px;">{{leg.duration|tominutes}} mins </span> <span ng-show="leg.fare>0">P{{leg.fare}}</span></p>' + '<p ng-hide="showMe"><em>{{leg.route}}</em></p>' + '<p ng-show="showMe">' + '<em>{{leg.from.name}}</em> to <em>{{leg.to.name}}</em>' + '</p>' + '<ul ng-show="leg.steps.length && selectedStep==leg" class="direction-steps">' + '<li ng-repeat="step in leg.steps">' + '<span>{{step.relativeDirection|parseDirection}} on {{step.streetName}}</span>' + '</li>' + '</ul>' + '<p ng-show="trueMode!=\'RAIL\' && (leg.steps.length==0 && selectedStep==leg)" class="direction-steps">' + '<span><em>{{leg.from.name}}</em> to <em>{{leg.to.name}}</em></span>' + '</p>' + '</div>' + '</div>',
      replace: true
    };
  }
]);
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
        $('.antiscroll-wrap').antiscroll();
      },
      template: '<div class="line-nav clearfix {{selectedLine.name}}" ng-transclude>' + '<ul>' + '<li ng-repeat="i in lines" class="{{i.name}}" ng-class="{active:i.name == selectedLine.name}" ng-click="lineSelected(i)">' + '{{i.shortName}}' + '</li>' + '</ul>' + '<div class="stop-desc" ng-class="{true:\'showdetails\', false:\'nodetails\'}[showDetails]"></div>' + '<table class="line-desc" ng-class="{true:\'nodetails\', false:\'showdetails\'}[showDetails]">' + '<tr>' + '<td>Weekdays: {{selectedLine.details.weekdays}}</td>' + '</tr>' + '<tr>' + '<td>Weekend: {{selectedLine.details.weekend}}</td>' + '</tr>' + '<tr ng-show="selectedLine.details.svc">' + '<td>Stored Value Card: {{selectedLine.details.svc}}</td>' + '</tr>' + '</table>' + '</div>',
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
        var svgHeight = $(window).height() - 90;
        var svg = d3.select('#line-stop-svg').append('svg').attr('class', 'line-stop-chart').attr('width', 260).attr('height', svgHeight);
        var lineWidth = 7;
        var centerX = 123;
        svg.append('rect').attr('class', 'vertical').attr('x', centerX - lineWidth / 2).attr('width', lineWidth).attr('y', 20);
        scope.$watch('selectedLine', function (newValue, oldValue) {
          if (newValue && newValue.stops) {
            svg.selectAll('.transfer').remove();
            svg.selectAll('.disabled').remove();
            console.log('svgHeight', svgHeight, 'linestops: ', newValue.stops);
            y = d3.scale.linear().domain([
              0,
              newValue.stops.length - 1
            ]).range([
              0,
              svgHeight - 30
            ]);
            for (var i in newValue.stops) {
              svg.selectAll('.vertical').attr('height', function (d) {
                if (newValue.name == 'PNR') {
                  return svgHeight - 140;
                }
                return svgHeight - 30;
              }).attr('class', 'vertical ' + newValue.name);
              var text = svg.selectAll('.label').data(newValue.stops, function (d) {
                  return d.stop_id;
                });
              text.enter().append('text').attr('class', function (d, i) {
                var _class = 'label';
                if (d.transfer) {
                  var names = d.transfer.stop_name.split(' ');
                  svg.append('text').attr('class', 'transfer').attr('x', centerX + 40).attr('y', y(i) + 23).text(function () {
                    return names[0].toUpperCase() + ' ' + names[1].toUpperCase();
                  }).on('click', function () {
                    scope.onSelectedStop(StopsService.getStopById(d.transfer.stop_id));
                  });
                  if (names.length > 1) {
                    if (names[2]) {
                      svg.append('text').attr('class', 'transfer').attr('x', centerX + 40).attr('y', y(i) + 33).text(function () {
                        return names[2].toUpperCase();
                      });
                    }
                  }
                }
                if (d.disabled) {
                  if (i < newValue.stops.length) {
                    svg.append('rect').attr('class', 'disabled').attr('x', centerX - lineWidth / 2).attr('y', y(i) - 5).attr('width', lineWidth).attr('height', y(i + 1) - y(i));
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
              }).on('click', function (d) {
                scope.onSelectedStop(d);
              });
              text.exit().remove();
              var dots = svg.selectAll('.stop').data(newValue.stops, function (d) {
                  return d.stop_id;
                });
              dots.enter().append('circle').attr('class', function (d, i) {
                var _class = 'stop ';
                if (d.transfer) {
                  svg.append('rect').attr('class', 'transfer ' + d.transfer.line_name).attr('x', centerX + 11).attr('y', y(i) + 18).attr('width', 10).attr('height', 3).attr('fill', '#333');
                  svg.append('circle').attr('class', 'transfer ' + d.transfer.line_name).attr('cx', centerX + 25).attr('cy', y(i) + 20).attr('r', 7).on('click', function () {
                    scope.onSelectedStop(StopsService.getStopById(d.transfer.stop_id));
                  });
                  return _class += 'transferee';
                }
                if (d.disabled) {
                  dots.append('rect').attr('class', 'disabled').attr('x', centerX - lineWidth / 2).attr('y', y(i)).attr('width', lineWidth).attr('height', y(i + 1) + 20);
                  return _class += 'disabled';
                }
                if (i == 0 || i == newValue.stops.length - 1) {
                  return _class += newValue.name;
                }
                return _class;
              }).attr('cx', centerX).attr('cy', function (d, i) {
                return y(i) + 20;
              }).attr('r', function (d, i) {
                if (d.transfer) {
                  return 7;
                }
                if (i == 0 || i == newValue.stops.length - 1) {
                  return 7;
                }
                return 4.5;
              }).on('click', function (d) {
                scope.onSelectedStop(d);
              });
              dots.exit().remove();
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
angular.module('uiModule').directive('nearby', function () {
  return {
    restrict: 'E',
    transclude: true,
    link: function (scope) {
      scope.selectedNearby = 'Places';
      scope.setNearby = function (choice) {
        scope.selectedNearby = choice;
        console.log('selectedNearby', scope.selectedNearby);
      };
    },
    template: '<div ng-switch on="selectedNearby" class="nearby">' + '<ul>' + '<li ng-click="setNearby(\'Places\')" ng-class="{active:selectedNearby==\'Places\'}">' + '<a ng-click="setNearby(\'Places\')" target="_blank">Places</a>' + '</li>' + '<li ng-click="setNearby(\'Stops\')" ng-class="{active:selectedNearby==\'Stops\'}">' + '<a ng-click="setNearby(\'Stops\')" target="_blank">Stops</a>' + '</li>' + '</ul>' + '<div ng-switch-when="Places">' + '<div class="antiscroll-wrap">' + '<div class="block">' + '<div class="antiscroll-inner">' + '<div class="group-list">' + '<placesbox title="Hospital" icon="icon-hospital" on-query-places="getLimitedPlaces" places="selected.hospital" category="Hospital" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>' + '<placesbox title="Hotel" icon="icon-hotel" on-query-places="getLimitedPlaces" places="selected.hotel" category="Hotel" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>' + '<placesbox title="Office" icon="icon-office" on-query-places="getLimitedPlaces" places="selected.office" category="Office" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>' + '<placesbox title="Sightseeing" icon="icon-sights" on-query-places="getLimitedPlaces" places="selected.sights" category="Sightseeing" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>' + '<placesbox title="Shopping" icon="icon-shopping" on-query-places="getLimitedPlaces" places="selected.shops" category="Shopping" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '<div ng-switch-when="Stops">' + '<div class="antiscroll-wrap">' + '<div class="block">' + '<div class="antiscroll-inner">' + '<div class="group-list">' + 'STOPS' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>',
    replace: true
  };
});
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
      resultPlaces: '=',
      onSearch: '=',
      setStop: '='
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
        console.log('searchbox', scope.searchStr, selectedCategory);
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
      scope.selectPlace = function (lineId, stopId) {
        console.log('lineId', lineId, 'stopId', stopId);
        scope.setStop(lineId, stopId);
      };
    },
    template: '<div>' + '<div class="antiscroll-wrap">' + '<div class="block">' + '<div class="antiscroll-inner">' + '<div ng-show="resultPlaces.length==0" class="places-list" ng-transclude>' + '<ul>' + '<li ng-repeat="place in places">' + '<a class="places-place" ng-click="selectPlace(place.line.line_name, place.stop.stop_id)" target="_blank">' + '<span class="name">{{place.name}}</span>' + '<span class="dist">{{place.distance}}</span>' + '<div class="{{place.line.line_name}} square"></div>' + '</a>' + '</li>' + '</ul>' + '</div>' + '<div ng-show="resultPlaces.length>0" class="places-list" ng-transclude>' + '<ul>' + '<li ng-repeat="resultPlace in resultPlaces">' + '<a class="places-place" ng-click="selectPlace(resultPlace.line.line_name, resultPlace.stop.stop_id)" target="_blank">' + '<span class="name">{{resultPlace.name}}</span>' + '<span class="dist">{{resultPlace.distance}}</span>' + '<div class="{{resultPlace.line.line_name}} square"></div>' + '</a>' + '</li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a ng-show="resultPlaces==0 && counter*20<=places.totalcount-20" ng-click="loadPlaces(counter=counter+1, selectedCategory)">Load more...</a>' + '</div>',
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
      stopname: '=',
      selectedDest: '='
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
      scope.selectDest = function (dest) {
        if (scope.selectedDest) {
          scope.selectedDest.isSelected = false;
        }
        scope.selectedDest = dest;
        scope.selectedDest.isSelected = true;
        console.log('selectedDest!!!', scope.selectedDest);
      };
    },
    template: '<div class="places-box" ng-hide="!places.data.length">' + '<div><h3>{{title}}</h3><i class="{{icon}}"></i></div>' + '<ul>' + '<li ng-repeat="place in places.data" ng-class="{active:place.isSelected}">' + '<a ng-click="selectDest(place)" target="_blank">' + '<span class="name">{{place.name}}</span>' + '<span class="distance">{{place.distance}}</span>' + '</a>' + '</li>' + '<li ng-show="!places.data.length">No sights near the area.</li>' + '</ul>' + '<a ng-show="places.counter*5<=places.totalcount-5" ng-click="loadPlaces(places.counter+1)">More...</a>' + '</div>',
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
angular.module('uiModule').directive('route', [
  '$filter',
  function ($filter) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        trip: '=',
        isselected: '&'
      },
      link: function (scope) {
        scope.steps = [];
        console.log('trip', scope.trip.legs);
        var legs = scope.trip.legs;
        for (var i in legs) {
          console.log(legs[i]);
          var trueMode = $filter('realmode')(legs[i].mode, legs[i].routeId);
          var routeCode;
          switch (trueMode) {
          case 'JEEP':
            routeCode = 'JEEP';
            break;
          case 'BUS':
            routeCode = 'BUS';
            break;
          case 'WALK':
            break;
          default:
            routeCode = $filter('lineCode')(legs[i].route);
            trueMode = legs[i].route;
            break;
          }
          var stepObj = {
              mode: trueMode,
              route: routeCode
            };
          scope.steps.push(stepObj);
        }
      },
      template: '<div ng-class="{selectedroute: isselected() == true}">' + '<ul>' + '<li ng-repeat="step in steps" class="route-steps">' + '<div>' + '<span>{{step.mode}}</span>' + '<span class="route-box {{step.route}}" ng-hide="step.mode==\'WALK\'">&#9632;</span>' + '<span ng-hide="$last"> &#9656;</span>' + '</div>' + '</li>' + '</ul>' + '<span>{{trip.duration|tominutes}} min </span> <span ng-show="trip.fare > 0">P{{trip.fare}}</span>' + '</div>',
      replace: true
    };
  }
]);
'use strict';
angular.module('uiModule').directive('search', function () {
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
        }).blur(function () {
        }).keyup(function (evt) {
          if (evt.keyCode === KEYS.ENTER) {
            scope.searchStr = $(this).val();
            scope.$apply();
          }
        });
      });
    },
    template: '<div>' + '<div class="search-form">' + '<i class="icon-search"></i>' + '<input type="text" placeholder="Search" class="search-box">' + '</div>' + '</div>',
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
        scope.theImage = '/images/hyperloop.jpg';
        scope.$watch('images', function (newValue, oldValue) {
          if (newValue) {
          }
        });
      },
      template: '<div class="images-box slideshow" ng-transclude>' + '<h3>Photos</h3>' + '<div class="slideshow-content">' + '<div class="main-img"><img src="{{theImage}}"></img></div>' + '<ul class="sub-image">' + '<li ng-repeat="img in images" >' + '<div class="image-group">' + '<!-- <img ng-show="theImage != img" src="{{img}}"></img> -->' + '</div>' + '</li>' + '</ul>' + '</div>' + '</div>',
      replace: true
    };
  }]);
'use strict';
angular.module('uiModule').directive('tips', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: { tips: '=data' },
    link: function (scope) {
      scope.clickedTip = function (tip) {
        console.log('tip', tip);
        for (var i in scope.tips) {
          scope.tips[i].selected = scope.tips[i].title == tip ? true : false;
        }
        console.log('selectedTip', scope.tips);
      };
    },
    template: '<div class="tips">' + '<ul>' + '<li ng-repeat="tip in tips" ng-click="clickedTip(tip.title)">' + '<h6>{{tip.title}}</h6>' + '<div ng-show="tip.selected" ng-hide="tip.selected==false">' + '<img src="{{tip.image}}" />' + '<p ng-repeat="detail in tip.details">{{detail}}</p>' + '</div>' + '</li>' + '</ul>' + '</div>',
    replace: true
  };
});
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
  '$filter',
  function ($http, $filter) {
    var DirectionsService = {};
    var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';
    var fareMatrix = {};
    function serialize(obj) {
      var str = [];
      for (var p in obj)
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      return str.join('&');
    }
    DirectionsService.bindFareMatrix = function (type, matrix) {
      switch (type) {
      case 'TRAIN':
        fareMatrix.train = matrix;
        break;
      case 'BUS':
        fareMatrix.bus = matrix;
        break;
      case 'JEEP':
        fareMatrix.jeep = matrix;
      }
    };
    DirectionsService.getStopsNearPoint = function (query, callback, err) {
      var query = serialize({
          lat: query.from.lat,
          lon: query.from.lon
        });
      var url = api + '/transit/stopsNearPoint?' + query + '&callback=JSON_CALLBACK';
      $http.jsonp(url).success(function (data) {
        if (data.error) {
          err(data.error);
          return;
        }
        console.log('Stops Near Point:');
        console.log(data);
        var stops = [];
        for (var i in data.stops) {
          var stop = data.stops[i];
          if (stop.stopName.indexOf('PNR') == -1 && stop.stopName.indexOf('LRT') == -1 && stop.stopName.indexOf('MRT') == -1) {
            stops.push(stop);
          }
        }
        callback(stops);
      }).error(function (data, status, headers, config) {
        console.log('Error on API Request');
        console.log(status);
        err(status);
      });
    };
    DirectionsService.getDirections = function (query, callback, err) {
      if (!query.from || !query.to) {
        err({ msg: 'Missing path information' });
        return;
      }
      function extractLocation(str) {
        var arr = str.substring(1, str.length - 1).split(',');
        return {
          lat: parseFloat(arr[0]),
          lng: parseFloat(arr[1])
        };
      }
      var from = extractLocation('' + query.from.geometry.location);
      var to = extractLocation('' + query.to.geometry.location);
      var d = new Date();
      var dateNow = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      var bannedAgencies = '';
      if (query.avoidBuses) {
        bannedAgencies += 'LTFRB';
      }
      var query = serialize({
          bannedAgencies: bannedAgencies,
          unpreferredAgencies: 'LTFRB',
          preferredAgencies: 'LRTA,MRTC,PNR',
          date: dateNow + '&time=11:59am',
          fromPlace: from.lat + ',' + from.lng,
          toPlace: to.lat + ',' + to.lng,
          mode: 'TRANSIT,WALK'
        });
      var url = api + '/plan?' + query + '&callback=JSON_CALLBACK';
      console.log(url);
      $http.jsonp(url).success(function (data) {
        if (data.error) {
          err(data.error);
          return;
        }
        function calculateFare(trip) {
          var totalFare = 0;
          angular.forEach(trip.legs, function (leg) {
            var realMode = $filter('realmode')(leg.mode, leg.routeId), distance = Math.round(leg.distance / 1000), foundFare = 0;
            switch (realMode) {
            case 'RAIL':
              switch (leg.routeShortName) {
              case 'LRT 1':
                foundFare = 10;
                break;
              case 'LRT 2':
                foundFare = 20;
                break;
              case 'MRT-3':
                foundFare = 30;
                break;
              case 'PNR MC':
                foundFare = 40;
                break;
              }
              break;
            case 'JEEP':
              var jeepMatrix = fareMatrix.jeep.matrix;
              foundFare = distance > jeepMatrix.length ? jeepMatrix[jeepMatrix.length - 1][0] : jeepMatrix[distance][0];
              break;
            case 'BUS':
              var busMatrix = fareMatrix.bus.matrix;
              foundFare = distance > busMatrix.length ? busMatrix[busMatrix.length - 1][0] : busMatrix[distance][0];
              break;
            }
            leg.fare = foundFare;
            totalFare += leg.fare;
          });
          return totalFare;
        }
        function isSameTrip(tripA, tripB) {
          if ($filter('tominutes')(tripA.duration) != $filter('tominutes')(tripB.duration)) {
            return false;
          }
          for (var k = 0; k < tripA.legs.length; k++) {
            if (!tripB.legs[k]) {
              return false;
            }
            if (tripA.legs[k].from.name != tripB.legs[k].from.name) {
              return false;
            }
          }
          return true;
        }
        console.log('===============');
        angular.forEach(data.plan.itineraries, function (trip) {
          var duration = 0;
          angular.forEach(trip.legs, function (leg) {
            duration += leg.duration;
          });
          trip.duration = duration;
        });
        var itineraries = [];
        for (var i = data.plan.itineraries.length - 1; i >= 0; i--) {
          var tripA = data.plan.itineraries[i];
          var tripB;
          var match = false;
          for (var j = i - 1; j >= 0; j--) {
            tripB = data.plan.itineraries[j];
            match = isSameTrip(tripA, tripB);
          }
          if (!match) {
            itineraries.push(tripA);
          }
        }
        for (var i in itineraries) {
          itineraries[i].fare = calculateFare(itineraries[i]);
        }
        data.plan.itineraries = itineraries;
        console.log(data.plan);
        callback(data.plan);
      }).error(function (data, status, headers, config) {
        console.log('Error on API Request');
        console.log(status);
        err(status);
      });
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
angular.module('trainguideServices').factory('FaresService', [
  '$http',
  function ($http) {
    var FaresService = {};
    FaresService.getPUJ = function (callback, err) {
      $http({
        method: 'GET',
        url: 'data/puj.data.json'
      }).success(function (data, status) {
        callback(data, status);
      }).error(function (data, status, headers, config) {
        err(data, status, headers, config);
      });
    };
    FaresService.getPUB = function (callback, err) {
      $http({
        method: 'GET',
        url: 'data/pub-aircon.data.json'
      }).success(function (data, status) {
        callback(data, status);
      }).error(function (data, status, headers, config) {
        err(data, status, headers, config);
      });
    };
    return FaresService;
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
    PlacesService.reverseGeocode = function (latlng, callback, err) {
      var geocodingAPI = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng.lat() + ',' + latlng.lng() + '&sensor=true';
      $http({
        method: 'GET',
        url: geocodingAPI
      }).success(function (data, status) {
        callback(data, status);
      }).error(function (data, status, headers, config) {
        err(data, status, headers, config);
      });
    };
    PlacesService.activeCategories = function () {
      var result = [];
      for (var i in PlacesService.categories) {
        if (PlacesService.categories[i].icon)
          result.push(PlacesService.categories[i]);
      }
      return result;
    };
    PlacesService.getPlacesBySearch = function (category, query, callback, err) {
      $http({
        method: 'GET',
        url: '/places/search-place/?category=' + category + '&queryStr=' + query + '&format=json'
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