'use strict';

angular.module('uiModule').directive('places', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedCategory : '=',
      searchStr : '=',
      getPlacesCount : '=',
			onQueryPlaces : '=',
			places : '=',
      resultPlaces : '=',
      onSearch : '=',
      setStop : '='
    },
    link : function(scope, element){
      var query = {};

      scope.$watch("searchStr", function(newValue, oldValue){
        // console.log('newValue', newValue, 'oldValue', oldValue);

        if(newValue || newValue===""){
          scope.resultPlaces = [];
          scope.loadPlaces(0, scope.selectedCategory); 
        }
      });

      scope.$watch("selectedCategory", function(newValue, oldValue){
        // console.log('newValue', newValue);
        query.queryStr = newValue;
        query.category = newValue;

        if(newValue){
          scope.places = [];  
          scope.resultPlaces = [];
          scope.counter = 0;     
          scope.loadPlaces(0, newValue); 
          scope.getPlacesCount(query);
        }
      });

      var limit = 20;
      scope.loadPlaces = function(counter, selectedCategory){
        console.log('searchbox', scope.searchStr, selectedCategory);
        if(scope.searchStr){
          var qry = {
            category : selectedCategory,
            queryStr : scope.searchStr
          };
          scope.onSearch(qry);
        }else{
          var qry = {
            limit: limit,
            start: (counter*limit),
            category: selectedCategory,
            stopname: ''
          }
          scope.onQueryPlaces(qry); 
        }
        $('.antiscroll-wrap').antiscroll();
      }

      scope.selectPlace = function(lineId, stopId){
        console.log('lineId', lineId, 'stopId', stopId);
        scope.setStop(lineId, stopId);
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
                    '<a class="places-place" ng-click="selectPlace(place.line.line_name, place.stop.stop_id)" target="_blank">'+
          				    '<span class="name">{{place.name}}</span>' +
                      '<span class="dist">{{place.distance}}</span>' +
                      '<div class="{{place.line.line_name}} square"></div>' +
                    '</a>'+
        				  '</li>' +
        				'</ul>' +
        			'</div>'+
              '<div ng-show="resultPlaces.length>0" class="places-list" ng-transclude>' +
                '<ul>' +
                  '<li ng-repeat="resultPlace in resultPlaces">' +
                    '<a class="places-place" ng-click="selectPlace(resultPlace.line.line_name, resultPlace.stop.stop_id)" target="_blank">'+
                      '<span class="name">{{resultPlace.name}}</span>' +
                      '<span class="dist">{{resultPlace.distance}}</span>' +
                      '<div class="{{resultPlace.line.line_name}} square"></div>' +
                    '</a>'+
                  '</li>' +
                '</ul>' +
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<a ng-show="resultPlaces==0 && counter*20<=places.totalcount-20" ng-click="loadPlaces(counter=counter+1, selectedCategory)">Load more...</a>'+
      '</div>',
    replace : true
  }
});