/**
 * Created with JetBrains WebStorm.
 * User: Julius
 * Date: 7/12/13
 * Time: 7:04 AM
 */
angular.module('uiModule').directive('radioGroup', ['$location', function($location){
  return {
    restrict : 'E',
    transclude : true,
    template : 
      '<div>'+
      '<ul>' +
        '<li ng-repeat="i in menuItems">'+
          '<a ng-click="navClick(i)" ng-class="{active:i.selected}"><span>{{i.title}}</span></a>'+
        '</li>'+
      '</ul>'+
      '</div>',
    scope : {
      menuItems : '=menuItems',
      selectedItemHandler : '=selectedItemHandler',
      selectedItem : '=selectedItem',
      selectedLine : '=selectedLine',
      showDetails : '=showDetails'   
    },                
    link: function(scope, elm, attr, ctrl){
      scope.previousItem = null;      
      scope.navClick = function(item){ 
        $location.path(item.title);     
        if(scope.selectedLine){
          $location.search('li', scope.selectedLine.name); 
        }

        if(item.title != 'Line' && ($location.search()).li){
          $location.search('li', null); 
        }

        scope.selectedItemHandler(item);
        $('.container').removeClass('adjust');
        scope.showDetails = false;  

        // if(scope.selectedItem){
        //   $location.path('');
        //   $location.search('li', null); 
        // }
      }
    },
    replace: true
  }
}]);