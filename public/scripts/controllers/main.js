
angular.module('trainguide.controllers')
	.controller('MainCtrl', ['$scope', '$http', '$route', 'LinesService', 'PlacesService', 'CommonAppState', function($scope, $http, $route, LinesService, PlacesService, CommonAppState){

    $scope.showDetails = false;
		$scope.selected = {
			stop: null,
      line: null,
      sights: null,
      shops: null
		};
		$scope.$watch('selected.stop', function(newValue){
      if(newValue){
				$scope.menuItems[0].selected = false; //reset line sidebar
        $scope.selectedItemHandler($scope.menuItems[0]);


      }
		});
    $scope.menuItems = [
      {
        title: 'Line',
        selected: false
      },
      {
        title: 'Places',
        selected: false
      },
      {
        title: 'Download',
        selected: false
      },
      {
        title: 'Tips',
        selected: false
      }];
    $scope.selectedItem = false;
    $scope.selectedItemHandler = function(item){
			for(var i in $scope.menuItems){
				if($scope.menuItems[i].title == item.title){
					$scope.menuItems[i].selected = !$scope.menuItems[i].selected;
					if($scope.menuItems[i].selected){
						if(item.title == 'Line' && !$scope.selected.line){
              // console.log('main.js $scope.selected.line', $scope.selected.line);
							$scope.selected.line = $scope.lines.LRT1;
              $scope.showDetails = false;
						}
						$scope.selectedItem = $scope.menuItems[i];
					}else{
						$scope.selectedItem = false;
					}
				}else{
					$scope.menuItems[i].selected = false;
				}
			}
			//if line is hidden, remove selected stop
			if(!$scope.menuItems[0].selected){
				$scope.selected.stop = null;
        $scope.showDetails = false;
			}

    };

    // $http({method: 'GET', url: 'data/lines.data.json'}).
    //   success(function(data, status){
    //     // console.log('LINES data: ', data);
    //     $scope.lines = data;
    //     for(key in data){ 
    //       $scope.lines[key].name = key;
    //     }
				// $scope.lines.LRT1.color = "#fdc33c";
				// $scope.lines.LRT2.color = "#ad86bc";
				// $scope.lines.MRT.color = "#5384c4";
				// $scope.lines.PNR.color = "#f28740";
    //     $scope.getLineByName = function(name){
    //       for(var i in $scope.lines){
    //         console.log('i', i, 'name', name);
    //         if(i == name){
    //           return $scope.lines[i];
    //         }
    //       }
    //       return null;
    //     };
    //   });

    LinesService.getLines(function(data, status){
      $scope.lines = data;
      for(key in data){ 
        $scope.lines[key].name = key;
      }
      $scope.lines.LRT1.color = "#fdc33c";
      $scope.lines.LRT2.color = "#ad86bc";
      $scope.lines.MRT.color = "#5384c4";
      $scope.lines.PNR.color = "#f28740";
      $scope.getLineByName = function(name){
        for(var i in $scope.lines){
          console.log('i', i, 'name', name);
          if(i == name){
            return $scope.lines[i];
          }
        }
        return null;
      };
    });

    $scope.getPlaces = function(qry){

      PlacesService.getPlacesByCategory(qry.queryStr,
        function(data) {
          if(qry.category=='Sightseeing'){
            $scope.selected.sights.totalcount = data.places.length;
            console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
          }
          if(qry.category=='Shopping'){
            $scope.selected.shops.totalcount = data.places.length;
            console.log('$scope.selected.sights.totalcount', $scope.selected.sights.totalcount);
          }
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
            if(qry.category=='Sightseeing'){
              $scope.selected.sights.push(data[item]); 
              console.log('$scope.selected.sights.push(data[item]);', $scope.selected.sights);
            }
            if(qry.category=='Shopping'){
              $scope.selected.shops.push(data[item]);
              console.log('$scope.selected.shops.push(data[item]);', $scope.selected.shops);
            }
          }
        },
        function(data, status, headers, config) {
          console.log('ERROR!!!!!!', data, status, headers, config);
        }
      );
    };

	}]);
