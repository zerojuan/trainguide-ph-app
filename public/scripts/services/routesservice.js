angular.module('trainguideServices')
  .factory('RoutesService', ['$http', function($http){
    var RoutesService = {};

    RoutesService.getRouteInfo = function(agency, routeId, callback, err){
      $http({method: 'GET', url: '/api/agencies/'+agency+'/routes/'+routeId})
        .success(function(data, status){
          callback(data, status);
        })
        .error(function(data, status, headers, config){
          err(data, status, headers, config);
        });
    }

    return RoutesService;
  }]);