angular.module('trainguideServices')
  .factory('StopsService', function(){
    var StopsService = {};
    var _lines = null;

    StopsService.setLines = function(lines){
      _lines = lines;
    }

    StopsService.getStopById = function(stopId){
      // console.log('stopId', stopId, '_lines', _lines);
      // loop through _lines
      for(key in _lines){
        var stops = _lines[key].stops;

        for (var i = 0; i < stops.length; i++) {
          if(stops[i].stop_id == stopId){
            stops[i].line_name = _lines[key].name;
            console.log('stops[i]', stops[i]);
            return stops[i];
          }
        };
      }
      // check if stops id is the same as parameter
      // return stop 
    }
    
    return StopsService;
  });