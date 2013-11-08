angular.module('trainguideServices')
  .factory('LinesService', ['$http', function($http){
      var LinesService = {};
      
      LinesService.getLines = function(callback, err){
        $http({method: 'GET', url: 'data/lines.data.json'})
          .success(function(data, status) {
            callback(data, status);
          })
          .error(function(data, status, headers, config) {
            err(data, status, headers, config);
          });
        
      }

      return LinesService;
  }]);