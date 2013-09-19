
angular.module('trainguide.controllers')
	.controller('GMapCtrl', ['$scope', function($scope){
		angular.extend($scope, {

			/** the initial center of the map */
			centerProperty: {
				latitude: 14.5833,
				longitude: 121
			},

			/** the initial zoom level of the map */
			zoomProperty: 14,

			/** list of markers to put in the map */
			markers: [],
			refresh: true,
			pathsProperty: [],
			stopMarkersProperty : []
		});

		function createMarker(val, icon, label){
			for(var i = 0; i < $scope.markers.length; i++){
				if($scope.markers[i].longitude == val.coordinates.lng && $scope.markers[i].latitude == val.coordinates.lat){
					$scope.markers.splice(i, 1);
					break;
				}
			}
			console.log('icon: ' + icon);
			$scope.markers.push({
				longitude: val.coordinates.lng,
				latitude: val.coordinates.lat,
				icon: icon,
				infoWindow: '<div id="content">'+label+'</div><div class="arrow-up"></div>',
				label: label
			});
		}

		function getColor(){
			switch($scope.selected.line.name){
				case 'PNR': return 'O';
				case 'LRT1': return 'Y';
				case 'LRT2': return 'P';
				case 'MRT': return 'B';
			}
		}

		$scope.$watch('selected.stop', function(newValue){
			//reset all markers
			console.log('selectedstop!!!', $scope.selected.stop);
			if(newValue){
				$scope.markers = [];
			}
		});

		$scope.$watch('selected.hospital.data', function(newValue){
			if(newValue){
				angular.forEach($scope.selected.hospital.data, function(val){
					createMarker(val, 'images/marker_medical22.png', val.name);
				});
			}
		}, true);

		$scope.$watch('selected.hotel.data', function(newValue){
			if(newValue){
				angular.forEach($scope.selected.hotel.data, function(val){
					createMarker(val, 'images/marker_hotel'+getColor()+'.png', val.name);
				});
			}
		}, true);

		$scope.$watch('selected.office.data', function(newValue){
			if(newValue){
				angular.forEach($scope.selected.office.data, function(val){
					createMarker(val, 'images/marker_office'+getColor()+'.png', val.name);
				});
			}
		}, true);

		$scope.$watch('selected.sights.data', function(newValue){
			if(newValue){
				angular.forEach($scope.selected.sights.data, function(val){
					createMarker(val, 'images/marker_sights'+getColor()+'.png', val.name);
				});
			}
		}, true);

		$scope.$watch('selected.shops.data', function(newValue){
			if(newValue){
				angular.forEach($scope.selected.shops.data, function(val){
					createMarker(val, 'images/marker_shopping'+getColor()+'.png', val.name);
				});
			}
		}, true);
	}]);