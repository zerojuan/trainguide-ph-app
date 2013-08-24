'use strict';

angular.module('uiModule').directive('categories', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      categories : '=',
      selectedCategory : '='
    },
    link : function(scope, element){
      scope.$watch("selectedCategory", function(newValue, oldValue){
        console.log('selectedCategory', newValue);
      });

      console.log('categories', scope.categories);

      scope.setCategory = function(category){
        scope.selectedCategory = category;
      }
    },
    template :
      '<div class="categories-list" ng-transclude>'+
        '<div>'+
          '<ul>'+
            '<li ng-show="category.icon" ng-repeat="category in categories">'+
              '<i class="{{category.icon}}" ng-click="setCategory(category.name)"></i>'+
              '<div ng-show="selectedCategory==category.name" class="down-btn"></div>'+
            '</li>'+
          '</ul>'+
        '</div>'+
        '<h6>{{selectedCategory}}</h6>'+
      '</div>',
    replace : true
  }
});