'use strict';

angular.module('uiModule').directive('places', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedCategory : '=',
      getPlacesCount : '=',
			onQueryPlaces : '=',
			places : '=',
      resultPlaces : '='
    },
    link : function(scope, element){
      var query = {};

      scope.$watch("selectedCategory", function(newValue, oldValue){
        console.log('newValue', newValue);
        query.queryStr = newValue;

        if(newValue){
          scope.places = [];  
          scope.counter = 0;     
          scope.loadPlaces(0, newValue); 
          scope.getPlacesCount(query);
        }
      });

      var limit = 20;
      scope.loadPlaces = function(counter, selectedCategory){
        var qry = {
          limit: limit,
          start: (counter*limit),
          category: selectedCategory,
          stopname: ''
        }
        scope.onQueryPlaces(qry);
        $('.antiscroll-wrap').antiscroll();
      }
    },
    template :
      '<div>'+
        '<div class="antiscroll-wrap">'+
          '<div class="block">'+
            '<div class="antiscroll-inner">'+
              '<div ng-show="resultPlaces.length==0" class="places-list" ng-transclude>' +
        				'<ul>' +
        				  '<li ng-repeat="place in places">' +
        				    '<span class="name">{{place.name}}</span>' +
                    '<span class="dist">{{place.distance}}</span>' +
                    '<div class="{{place.line.line_name}} square"></div>' +
        				  '</li>' +
        				'</ul>' +
        			'</div>'+
              '<div ng-show="resultPlaces.length>0" class="places-list" ng-transclude>' +
                '<ul>' +
                  '<li ng-repeat="resultPlace in resultPlaces">' +
                    '<span class="name">{{resultPlace.name}}</span>' +
                    '<span class="dist">{{resultPlace.distance}}</span>' +
                    '<div class="{{resultPlace.line.line_name}} square"></div>' +
                  '</li>' +
                '</ul>' +
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<a ng-show="((resultPlaces.length==0)&&(counter*20<=places.totalcount-20))" ng-click="loadPlaces(counter=counter+1, selectedCategory)">Load more...</a>'+
      '</div>',
    replace : true
  }
});