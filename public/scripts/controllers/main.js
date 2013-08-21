
angular.module('trainguide.controllers')
	.controller('MainCtrl', ['$scope', '$http', 'CommonAppState', function($scope, $http, CommonAppState){
    $scope.showDetails = false;
		$scope.selected = {
			stop: null,
      line: null
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
        title: 'Featured',
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
							$scope.selected.line = $scope.lines.LRT1;
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
			}

    };

    $http({method: 'GET', url: 'data/lines.data.json'}).
      success(function(data, status){
        console.log('LINES data: ', data);
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


	}]);
