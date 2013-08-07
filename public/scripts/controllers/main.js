/**
 * Created with JetBrains WebStorm.
 * User: Julius
 * Date: 7/12/13
 * Time: 6:44 AM
 */

angular.module('trainguide.controllers')
	.controller('MainCtrl', ['$scope', '$http', 'CommonAppState', function($scope, $http, CommonAppState){
		$scope.message = "Hello World";
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
        selected: false,
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

    $scope.$on('handleBroadcast[selectedLine]', function(){
      console.log('Line has been selected:');   
      $scope.selectedLine = CommonAppState.selectedLine;
      var lineData = {
        title : $scope.menuItems[0].title,
        selected : true     
      };
      $scope.selectedItem = lineData;
      $scope.$apply();
    });

    $scope.$on('handleBroadcast[selectedStop]', function(){   
      console.log("Changing state...");
      var lineData = {
        title : $scope.menuItems[0].title,
        selected : true,
        stop : CommonAppState.selectedStop,
        images : CommonAppState.selectedStop.details.image
      };
      $scope.selectedLine = $scope.getLineByName(lineData.stop.line);
      console.log("Selected Line", $scope.selectedLine);
      if($scope.previousSelectedStop && $scope.previousSelectedStop.name == CommonAppState.selectedStop.name){
        //disable the stop selection
        $scope.previousSelectedStop = null;
        lineData.selected = false;
        $scope.menuItems[0].selected = false;
        $scope.selectedItem = lineData;
      }else{
        $scope.menuItems[0].selected = true;
        $scope.selectedItem = lineData;
        $scope.previousSelectedStop = CommonAppState.selectedStop;
      }
      $scope.$apply();
    });
	}]);
