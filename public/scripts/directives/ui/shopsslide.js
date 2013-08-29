'use strict';

angular.module('uiModule').directive('shopsSlide', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedStop : '=',
      getPlacesCount : '=',
      onQueryPlaces : '=',
      shops : '='
    },
    link : function(scope, element, attr){
      scope.$watch("selectedStop", function(newValue, oldValue){
        if(newValue){
          scope.stopname = newValue.details.stop_name;
          scope.shops = [];    
          scope.counter = 0;
          scope.loadPlaces(0); 
          scope.getPlacesCount(scope.stopname);
        }
      });

      var limit = 5;
      scope.loadPlaces = function(counter){
        var qry = {
          limit: limit,
          start: (counter*limit),
          category: 'Shopping',
          stopname: scope.stopname
        }
        console.log('shops qry', qry);
        scope.onQueryPlaces(qry);
        $('.antiscroll-wrap').antiscroll();
      }
    },
    template :
      '<div class="shops-box">'+
        '<div><h3>Shopping</h3><i class="icon-shopping"></i></div>'+
        '<ul>'+
          '<li ng-repeat="shop in shops">'+
            '<div>'+
              '<span class="name">{{shop.name}}</span>'+
              '<span class="distance">{{shop.distance}}</span>'+
            '</div>'+
          '</li>'+
          '<li ng-show="!shops.length">No shops near the area.</li>'+
        '</ul>'+
        '<a ng-show="counter*5<=shops.totalcount-5" ng-click="loadPlaces(counter=counter+1)">More...</a>'+
      '</div>',
    replace : true
  }
});