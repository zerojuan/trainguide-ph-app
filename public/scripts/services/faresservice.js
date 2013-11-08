angular.module('trainguideServices')
  .factory('FaresService', ['$http', function($http){
      var FaresService = {};

      FaresService.getPUJ = function(callback, err){
        $http({method: 'GET', url: 'data/puj.data.json'})
          .success(function(data, status){
            callback(data, status);
          })
          .error(function(data, status, headers, config) {
            err(data, status, headers, config);
          });
      };

      FaresService.getPUB = function(callback, err){
        $http({method: 'GET', url: 'data/pub-aircon.data.json'})
          .success(function(data, status){
            callback(data, status);
          })
          .error(function(data, status, headers, config) {
            err(data, status, headers, config);
          });
      }

      return FaresService;
  }]);