
angular.module('google-maps')
	.directive('globalizeMap', ['$rootScope', function($rootScope){
		return {
			require: '^googleMap',
			restrict: 'E',
			link: function(scope, elm, attrs, gmapCtrl){
				gmapCtrl.registerMapListener(scope);

				scope.onMapReady = function(map){
					console.log("Attach 'map' to $rootScope");
					$rootScope.map = map;
				}
			}
		}
	}]);