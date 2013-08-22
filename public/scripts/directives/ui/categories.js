'use strict';

angular.module('uiModule').directive('categories', ['$http', 'CommonAppState', function($http, CommonAppState){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedItem : '=selectedItem'
    },
    link : function(scope, element){
      console.log('scope.selectedItem', scope.selectedLine);
      scope.$watch("selectedItem", function(newValue, oldValue){
        console.log('categories.js scope.selectedItem', newValue);
        if(newValue.title == 'Places'){
          var qry = {
              format: 'json',
              queryStr: 'hospital'
          }
          console.log('qry!!!!!!!', qry);
          
        }

      });
    },
    template :
      '<div>HELLO!!!{{scope.hospitals}}</div>',
    replace : true
  }
}]);