'use strict';

angular.module('uiModule').directive('direction', ['$filter', function($filter){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      leg : '=',
      isLast: '&isLast'
    },
    link : function(scope, elm, attrs){
      $('.antiscroll-wrap').antiscroll();
      
      scope.selectedStep = null;
      scope.divClass = 'align';
      scope.trueMode = $filter('realmode')(scope.leg.mode, scope.leg.routeId);
      scope.showMe = (scope.trueMode == 'WALK' || scope.trueMode == 'RAIL');      
      console.log('leg route', scope.leg.route);
      if(scope.leg.route){
        switch(scope.leg.route){
          case 'LRT 1':
            scope.routeCode = 'LRT1';
            break;
          case 'LRT 2':
            scope.routeCode = 'LRT2';
            break;
          case 'MRT-3':
            scope.routeCode = 'MRT';
            break;
          default:
            scope.routeCode = 'PNR';
            break;
        }
      }
      if(!scope.isLast()){
        scope.divClass = scope.trueMode;
        if(scope.trueMode == 'RAIL')
        scope.divClass += ' ' + scope.routeCode;
      }

      scope.clickedDirection = function(leg){
        if(scope.selectedStep == null){
          scope.selectedStep = leg; 
        }else{
          scope.selectedStep = null;
        }
      };

      console.log('scope.trueMode', scope.trueMode, 'scope.showMe', scope.showMe, 'scope.isLast', scope.isLast(), 'scope.divClass', scope.divClass);
    },
    template :
      '<div>'+
        '<div class="{{divClass}}">'+
          '<div class="{{trueMode}} circle {{routeCode}}"></div>'+
          '<p>{{trueMode}}</p>'+
          '<p ng-hide="showMe"><em>{{leg.route}}</em></p>'+
          '<p ng-show="showMe" ng-class="{isparent: leg.steps.length>0}" ng-click="clickedDirection(leg)">'+
            '<em>{{leg.from.name}}</em> to <em>{{leg.to.name}}</em>'+
          '</p>'+
          '<ul ng-show="leg.steps.length && selectedStep==leg" class="direction-steps">'+
            '<li ng-repeat="step in leg.steps">'+
              '<span>{{step.relativeDirection}} on {{step.streetName}}</span>'+
            '</li>'+
          '</ul>'+
        '</div>'+
      '</div>',
    replace : true
  }
}]);