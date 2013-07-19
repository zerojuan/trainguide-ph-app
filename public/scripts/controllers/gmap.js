
angular.module('trainguide.controllers')
	.controller('GMapCtrl', ['$scope', function($scope){
		angular.extend($scope, {

			/** the initial center of the map */
			centerProperty: {
				lat: 14.5833,
				lng: 121
			},

			/** the initial zoom level of the map */
			zoomProperty: 14,

			/** list of markers to put in the map */
			markersProperty: [],

			pathsProperty: [],
			stopMarkersProperty : [],

			// These 2 properties will be set when clicking on the map
			clickedLatitudeProperty: null,
			clickedLongitudeProperty: null
		});
	}]);