
angular.module('trainguide.controllers')
	.controller('DirectionCtrl', ['$scope', 'DirectionsService', 'StopsService', function($scope, DirectionsService, StopsService){
		angular.extend($scope, {
			direction: {
				activeTrip: null
			},
			plan: null,
			avoidBuses: true,
			loadingQuery: false
		});

		$scope.getDirections = function(){
			$scope.loadingQuery = true;
			DirectionsService.getDirections({from: $scope.selected.direction.from, to: $scope.selected.direction.to, avoidBuses: $scope.avoidBuses},
				function(data){
//					data.itineraries []
//						- legs []
//							- leg.from.name
//							- leg.to.name
//							- leg.legGeometry
//							- leg.mode
//					 		- leg.steps
					console.log(data);
					$scope.plan = data;
					$scope.selected.itinerary= $scope.plan.itineraries[0];
					$scope.loadingQuery = false;
					$scope.errorMessage = null;
				},
				function(err){
					console.log("Some error occured", err);
					$scope.loadingQuery = false;
					$scope.errorMessage = err.msg;
				});
		}
//		getRealMode: function(mode, routeId) {
//			if(mode == 'BUS') {
//				if(routeId.indexOf('PUJ') >= 0) {
//					return 'JEEP';
//				}
//				else {
//					return 'BUS';
//				}
//			}
//			else {
//				return mode;
//			}
//		}
	}]);
