'use strict';

angular.module('uiModule').directive('places', ['CommonAppState', function(CommonAppState){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedCategory : '=',
      getPlacesCount : '=',
			onQueryPlaces : '=',
			places : '=',
      activeCategories : '='
    },
    link : function(scope, element){
      var activeCategories = scope.activeCategories();
      // console.log('activeCategories', activeCategories);
      var query = {};

      scope.$watch("selectedCategory", function(newValue, oldValue){
        console.log('newValue', newValue);
        query.queryStr = newValue;

        if(newValue){
          scope.places = [];       
          scope.loadPlaces(0, newValue); 
          scope.getPlacesCount(query);
          $('.antiscroll-wrap').antiscroll();
        }
      });

      var limit = 5;
      scope.loadPlaces = function(counter, selectedCategory){
        var qry = {
          limit: limit,
          start: (counter*limit),
          category: selectedCategory
        }
        scope.onQueryPlaces(qry);
      }
    },
    template :
      '<div class="antiscroll-wrap">'+
        '<div class="block">'+
          '<div class="antiscroll-inner">'+
            '<div class="places-list" ng-transclude>' +
      				'<ul>' +
      				  '<li ng-repeat="place in places">' +
      				    '<span class="name">{{place.name}}</span>' +
                  '<span class="dist">{{place.distance}}</span>' +
                  '<div class="{{place.line.line_name}} square"></div>' +
      				  '</li>' +
      				'</ul>' +
              '<a ng-show="counter*5<=places.totalcount-5" ng-click="loadPlaces(counter=counter+1, selectedCategory)" ng-init="counter=0">More...</a>'+
      			'</div>'+
          '</div>'+
        '</div>'+
      '</div>',
    replace : true
  }
}]);