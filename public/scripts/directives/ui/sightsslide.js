'use strict';

angular.module('uiModule').directive('sightsSlide', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedStop : '=',
      getPlacesCount : '=',
      onQueryPlaces : '=',
      sights : '='
    },
    link : function(scope, element, attr){
      scope.$watch("selectedStop", function(newValue, oldValue){
        // console.log('selectedStop', newValue);
        if(newValue){
          scope.stopname = newValue.details.stop_name;
          scope.sights = [];   
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
          category: 'Sightseeing',
          stopname: scope.stopname
        }
        console.log('sights qry', qry);
        scope.onQueryPlaces(qry);
        $('.antiscroll-wrap').antiscroll();
      }
    },
    template :
    '<div class="sights-box">'+
      '<h3>Sightseeing</h3>'+
      '<ul>'+
        '<li ng-repeat="sight in sights">'+
          '<div>'+
            '<span class="name">{{sight.name}}</span>'+
            '<span class="distance">{{sight.distance}}</span>'+
          '</div>'+
        '</li>'+
        '<li ng-show="!sights.length">No sights near the area.</li>'+
      '</ul>'+
      '<a ng-show="counter*5<=sights.totalcount-5" ng-click="loadPlaces(counter=counter+1)">More...</a>'+
    '</div>',
    replace : true
  }
});