/**
 * Created with JetBrains WebStorm.
 * User: Julius
 * Date: 7/12/13
 * Time: 6:44 AM
 */

angular.module('trainguide.controllers')
	.controller('MainCtrl', ['$scope', function($scope){
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
	}]);
