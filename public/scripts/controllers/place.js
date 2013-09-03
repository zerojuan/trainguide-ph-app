angular.module('trainguide.controllers')
  .controller('PlaceCtrl', ['$scope', '$http', 'LinesService', 'PlacesService', function($scope, $http, LinesService, PlacesService){    
    $scope.places = [];
    $scope.resultPlaces = [];

    $scope.searchStr = null;
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

			PlacesService.getPlacesBySearch(qry.category, qry.queryStr,
				function(data) {
					$scope.places.totalcount = data.places.length;
          // console.log('getPlacesBySearch $scope.places', $scope.places, data.places.length, data);
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

    $scope.searchFn = function(qry){
      $scope.resultPlaces = [];
      
      PlacesService.getPlacesBySearch(qry.category, qry.queryStr,
        function(data){
          var places = data.places;
          for(var i=0; i < places.length; i++){
            for(key in $scope.lines){
              if($scope.lines[key].shortName == places[i].line.name){
                places[i].line.line_name = $scope.lines[key].name;
              }
            }
            $scope.resultPlaces.push(places[i]);
          }
          console.log('$scope.resultPlaces' + qry.queryStr, $scope.resultPlaces);
        },
        function(data, status, headers, config) {
          console.log('ERROR!!!!!!' + qry.queryStr, data, status, config);
        }
      );
    };

  }]);