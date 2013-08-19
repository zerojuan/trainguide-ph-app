
angular.module('trainguide.controllers')
	.controller('MainCtrl', ['$scope', '$http', 'CommonAppState', function($scope, $http, CommonAppState){
		$scope.selected = {
			stop: null,
      line: null
		};
		$scope.$watch('selected.stop', function(){
			console.log("Selected stop changed!!!!");
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
    $scope.selectedItemHandler = function(){
      for(var i in this.menuItems){
        var item = this.menuItems[i];
        console.log(item);
        if(item.selected){
          this.selectedItem = item;
          return;
        }
      }
      this.selectedItem = false;
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
        $scope.selectedLine = $scope.lines.LRT1;
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
