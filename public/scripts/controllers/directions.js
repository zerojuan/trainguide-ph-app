
angular.module('trainguide.controllers')
	.controller('DirectionCtrl', ['$scope', 'DirectionsService', 'StopsService', function($scope, DirectionsService, StopsService){
		angular.extend($scope, {
			direction: {
				from: null,
				to: null,
				activeTrip: null
			},
			plan: null,
			loadingQuery: false,
			errorMessage: null
		});

		$scope.getDirections = function(){
			$scope.loadingQuery = true;
			DirectionsService.getDirections({from: $scope.direction.from, to: $scope.direction.to},
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
