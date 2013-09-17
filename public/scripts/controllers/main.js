
angular.module('trainguide.controllers')
	.controller('MainCtrl', ['$scope', '$http', '$route', 
    'LinesService', 'StopsService', 'TransfersService', 'PlacesService', 'CommonAppState', 
    function($scope, $http, $route, 
      LinesService, StopsService, TransfersService, PlacesService, CommonAppState){


		/** ================================================= **/
		/** SCOPE VARIABLES
		/** ================================================= **/
		angular.extend($scope, {
			clickedLatitudeProperty: 11,
			clickedLongitudeProperty: 44,

			showDetails: false,
			selected: {
				stop: null,
				line: null,
				dest : null,
				sights: {
					counter: 0,
					data: []
				},
				shops: {
					counter: 0,
					data: []
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
					title: 'Download',
					selected: false
				},
				{
					title: 'Tips',
					selected: false
			}],
			selectedItem : false
		});

		/** ================================================= **/
		/** WATCHERS
		/** ================================================= **/
		$scope.$watch('selected.stop', function(newValue){
      if(newValue){
				$scope.menuItems[0].selected = false; //reset line sidebar
        $scope.selectedItemHandler($scope.menuItems[0]);
				reloadStopsPlaces();
      }
		});

		/** ================================================== **/
		/** SCOPE METHODS
    /** ================================================== **/
		 $scope.selectedItemHandler = function(item){
			for(var i in $scope.menuItems){
				if($scope.menuItems[i].title == item.title){
					$scope.menuItems[i].selected = !$scope.menuItems[i].selected;
					if($scope.menuItems[i].selected){
						if(item.title == 'Line' && !$scope.selected.line){
              // console.log('main.js $scope.selected.line', $scope.selected.line);
							$scope.selected.line = $scope.lines.LRT1;
              $scope.showDetails = false;
              $scope.getLineDetails($scope.selected.line);
						}
						$scope.selectedItem = $scope.menuItems[i];

					}else{
						$scope.selectedItem = false;
					}
				}else{
					$scope.menuItems[i].selected = false;
				}
			}
			//if line is hidden, remove selected stop
			if(!$scope.menuItems[0].selected){
				$scope.selected.stop = null;
        $scope.showDetails = false;
			}
    };

		$scope.getLineByName = function(name){
			for(var i in $scope.lines){
				console.log('i', i, 'name', name);
				if(i == name){
					return $scope.lines[i];
				}
			}
			return null;
		};

		$scope.getLineDetails = function(line){
			// console.log('$scope.selected.line', line);
			$http({method: 'GET', url: '/api/details/' + line.route_id})
				.success(function(data){
					$scope.selected.line.details = data;
				})
				.error(function(data, status, headers, config){
					console.log('ERROR!!!!!!', data, status, headers, config);
				});
		};

		$scope.getPlaces = function(qry){

			PlacesService.getPlacesBySearch(qry.queryStr,
				function(data) {
					if(qry.category=='Sightseeing'){
						$scope.selected.sights.totalcount = data.places.length;
						// console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
					}
					if(qry.category=='Shopping'){
						$scope.selected.shops.totalcount = data.places.length;
						// console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
					}
				},
				function(data, status, headers, config) {
					console.log('ERROR!!!!!!', data, status, headers, config);
				}
			);
		};

		$scope.getLimitedPlaces = function(qry){

			PlacesService.getPlacesByLimitedCategory(qry.category, qry.stopname, qry.start, qry.limit,
				function(data) {
					console.log("Get places done: ");
					console.log(data);
					if(qry.category=='Sightseeing'){
						$scope.selected.sights.counter = qry.start;
						Array.prototype.push.apply($scope.selected.sights.data, data);
					}else if(qry.category=='Shopping'){
						$scope.selected.shops.counter = qry.start;
						Array.prototype.push.apply($scope.selected.shops.data, data);
					}
					console.log($scope.selected);
				},
				function(data, status, headers, config) {
					console.log('ERROR!!!!!!', data, status, headers, config);
				}
			);
		};

		/** ================================================== **/
		/** LOCAL FUNCTIONS
		/** ================================================== **/
		function reloadStopsPlaces() {
			var limit = 5;
			var counter = 0;
			$scope.selected.sights.data = [];
			console.log("Getting stop name: ");
			var stopname = $scope.selected.stop.details.stop_name;
			console.log(stopname);
			$scope.getLimitedPlaces({
				limit: limit,
				start: (counter*limit),
				category: "Shopping",
				stopname: stopname
			});
			$scope.selected.shops.data = [];
			$scope.getLimitedPlaces({
				limit: limit,
				start: (counter*limit),
				category: "Sightseeing",
				stopname: stopname
			});
		}

		function initialize() {
			LinesService.getLines(function(data, status){
				$scope.lines = data;
				for(key in data){
					$scope.lines[key].name = key;
				}
				$scope.lines.LRT1.color = "#fdc33c";
				$scope.lines.LRT2.color = "#ad86bc";
				$scope.lines.MRT.color = "#5384c4";
				$scope.lines.PNR.color = "#f28740";
				StopsService.setLines($scope.lines);
				TransfersService.getAllTransfers(function(data){
					$scope.transfers = data;
					//iterate each transfer
					for (var i = 0; i < $scope.transfers.length; i++) {
						var fromStop = StopsService.getStopById($scope.transfers[i].from_stop_id);
						var toStop = StopsService.getStopById($scope.transfers[i].to_stop_id);
						// console.log('fromStop', fromStop, 'toStop', toStop);
						fromStop.transfer = {
							line_name : toStop.line_name,
							stop_id : toStop.details.stop_id,
							stop_name : toStop.details.stop_name,
							stop_lon : toStop.details.stop_lon,
							stop_lat : toStop.details.stop_lat
						};
					};
					//get stopFrom from StopsService.getStopById(fromId)
					//get transferTo from StopsService.getStopById(toId)
					// stopFrom.transfer = {stopId: transferTo.stopId, name: ... }
				}, function(data, status, headers, config){
					console.log('Error!', data, status, headers, config);
				});
			});
		}

		initialize();
	}]);
