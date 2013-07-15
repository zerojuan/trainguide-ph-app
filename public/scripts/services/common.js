
angular.module('trainguideServices')
	.factory('CommonAppState', ['$rootScope', function($rootScope){
		var commonAppService = {};

		commonAppService.selectedStop = {};
		commonAppService.selectedLine = {};

		commonAppService.prepForBroadcast = function(property, msg){
			console.log('Preparing for broadcast: ' + property);
			this[property] = msg;
			this.broadcastItem(property);
		};

		commonAppService.broadcastItem = function(property){
			$rootScope.$broadcast('handleBroadcast['+property+']');
		}

		return commonAppService;
	}]);