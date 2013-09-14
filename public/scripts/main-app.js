
angular.module("trainguide.filters", []);
angular.module("trainguideServices", []);
angular.module("uiModule", ["trainguideServices"]);
angular.module("google-maps", ["trainguideServices"]);
angular.module("trainguide.controllers", ["trainguideServices"]);


angular.module("trainguide", ["google-maps", "trainguide.filters", "trainguide.controllers", "uiModule"])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when('/:state');

	}]);

angular.module("trainguide.controllers")
	.controller("ViewerCtrl", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
		console.log($routeParams);
	}]);

