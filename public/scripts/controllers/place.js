angular.module('trainguide.controllers')
  .controller('PlaceCtrl', ['$scope', '$http', 'LinesService', 'PlacesService', function($scope, $http, LinesService, PlacesService){    
    $scope.places = [];

    $scope.activeCategories = PlacesService.activeCategories();
    $scope.selected = {
      category : $scope.activeCategories[0].name
    }

    var lines = null;
    LinesService.getLines(function(data){
      lines = data;
      for(key in data){
        lines[key].name = key;
      }
      // console.log('lines', lines);
    });

    $scope.getPlaces = function(qry){

			PlacesService.getPlacesByCategory(qry.queryStr,
				function(data) {
					$scope.places.totalcount = data.places.length;
          // console.log('getPlacesByCategory $scope.places', $scope.places, data.places.length, data);
				},
				function(data, status, headers, config) {
					console.log('ERROR!!!!!!', data, status, headers, config);
				}
			);
    };

    $scope.getLimitedPlaces = function(qry){

      PlacesService.getPlacesByLimitedCategory(qry.category, qry.stopname, qry.start, qry.limit,
        function(data) {
          for(var item in data){
            for(key in lines){
              if(lines[key].shortName == data[item].line.name){
                data[item].line.line_name = lines[key].name;
              }
            }
            $scope.places.push(data[item]);
          }
          // console.log('getLimitedPlaces data', data, '$scope.places', $scope.places);
        },
        function(data, status, headers, config) {
          console.log('ERROR!!!!!!', data, status, headers, config);
        }
      );
    };
  }]);