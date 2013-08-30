angular.module('trainguideServices')
  .factory('TransfersService', ['$http', function($http){
    var TransfersService = {};
    var _lines = null;
    

    TransfersService.getAllTransfers = function(callback, err){
      $http({method: 'GET', url: '/api/transfers'})
      .success(function(data){
        callback(data);        
      })
      .error(function(data, status, headers, config){
        err(data, status, headers, config);
      });  
    }
    
    return TransfersService;
  }]);