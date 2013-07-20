

var app = angular.module("viewerApp", []);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', {templateUrl: '/views/?url=viewer.partials.agencies', controller: 'ViewerCtrl'})
		.when('/:agency/routes', {templateUrl: '/views/?url=viewer.partials.routes', controller: 'RouteCtrl'})
		.when('/:agency/routes/:route/trips', {templateUrl: '/views/?url=viewer.partials.trips', controller: 'TripsCtrl'})
		.otherwise({
			redirectTo: '/'
		});
}]);

angular.module("viewerApp")
	.controller("ViewerCtrl", ['$scope', '$http', function($scope, $http){
		$scope.header = "Agencies";
		$scope.description = "This is the data you guys";
		$scope.agencies = [];

		$http({
			method: 'GET',
			url: 'api/agencies'})
			.success(function(data){
				console.log("Data is here!");
				console.log(data);
				//output data here as a table
				$scope.agencies = data;
			})
			.error(function(data, status){
				console.log("Error Happened")
			});
	}])
	.controller("RouteCtrl", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
		$scope.agencyId = $routeParams.agency;
		$scope.routes = [];
		$http({
			method: 'GET',
			url: 'api/agencies/'+$routeParams.agency+'/routes'})
			.success(function(data){
				console.log('Data is here!');
				console.log(data);
				$scope.routes = data;
			})
			.error(function(data, status){
				console.log('Error happened');
			});
	}])
	.controller("TripsCtrl", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
		$scope.agencyId = $routeParams.agency;
		$scope.routeId = $routeParams.route;

		$http({
			method: 'GET',
			url: 'api/routes/'+$scope.routeId+'/trips'})
			.success(function(data){
				console.log(data);
				$scope.trips = data;
			})
			.error(function(data, status){
				console.log('Error happened');
			});
	}]);