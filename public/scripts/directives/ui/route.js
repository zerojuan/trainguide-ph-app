'use strict';

angular.module('uiModule').directive('route', ['$filter', function($filter){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      trip : '=',
      isselected: '&'
    },
    link : function(scope){
      scope.steps = [];
      console.log('trip', scope.trip.legs);
      var legs = scope.trip.legs;
      for(var i in legs){
        console.log(legs[i]);
        var trueMode = $filter('realmode')(legs[i].mode, legs[i].routeId);
        var routeCode;
        switch(trueMode){
          case 'JEEP':
            routeCode = 'JEEP';
            break;
          case 'BUS':
            routeCode = 'BUS';
            break;
          case 'WALK':
            break;
          default:
            routeCode = $filter('lineCode')(legs[i].route);
            trueMode = legs[i].route;
            break;
        }

        var stepObj = {
          mode: trueMode,
          route: routeCode
        }

        scope.steps.push(stepObj);
      }
    },
    template :
      '<div ng-class="{selectedroute: isselected() == true}">'+
        '<ul>'+
          '<li ng-repeat="step in steps" class="route-steps">'+
            '<div>'+
              '<span>{{step.mode}}</span>'+
              '<span class="route-box {{step.route}}" ng-hide="step.mode==\'WALK\'">&#9632;</span>'+
              '<span ng-hide="$last"> &#9656;</span>'+
            '</div>'+
          '</li>'+
        '</ul>'+
        '<span>{{trip.duration|tominutes}} min</span>'+
      '</div>',
    replace : true
  }
}]);