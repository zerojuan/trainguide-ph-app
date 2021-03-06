'use strict';

angular.module('uiModule').directive('direction', ['$filter', function($filter){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      leg : '=',
      isLast: '&isLast',
			selectedLeg: '='
    },
    link : function(scope, elm, attrs){
      var height = $('.sidebar').height();

      var adjustScrollHeight = function(){
				var directionsStart = $('.steps-list').position().top;
				var directionsEnd = $('.footer').position().top;
				var calculatedHeight = (directionsEnd - directionsStart);
				$('.steps-list').css('height', calculatedHeight);
      }

      $(window).resize(function(){
        adjustScrollHeight();
      })
      
      adjustScrollHeight();
      scope.selectedStep = null;
      scope.divClass = 'align';
      scope.trueMode = $filter('realmode')(scope.leg.mode, scope.leg.routeId);
      scope.showMe = (scope.trueMode == 'WALK' || scope.trueMode == 'RAIL');  
      scope.routeCode = $filter('lineCode')(scope.leg.route);

      if(!scope.isLast()){
        scope.divClass = scope.trueMode;
        if(scope.trueMode == 'RAIL')
        scope.divClass += ' ' + scope.routeCode;
      }

			scope.$watch('leg', function(){
				adjustScrollHeight();
			}, true);

      scope.clickedDirection = function(leg){
        scope.selectedStep = (scope.selectedStep == null) ? leg : null;
				scope.selectedLeg = scope.selectedStep;
      };
    },
    template :
      '<div>'+
        '<div class="{{divClass}}" ng-class="{clickable: trueMode!=\'RAIL\'}" ng-click="clickedDirection(leg)">'+
          '<div class="{{trueMode}} circle {{routeCode}}"></div>'+
          '<p>{{trueMode}} <span style="font-size: 10px;">{{leg.duration|tominutes}} mins </span> <span ng-show="leg.fare>0">P{{leg.fare}}</span></p>'+
          '<p ng-hide="showMe"><em>{{leg.route}}</em></p>'+
          '<p ng-show="showMe">'+
            '<em>{{leg.from.name}}</em> to <em>{{leg.to.name}}</em>'+
          '</p>'+
          '<ul ng-show="leg.steps.length && selectedStep==leg" class="direction-steps">'+
            '<li ng-repeat="step in leg.steps">'+
              '<span>{{step.relativeDirection|parseDirection}} on {{step.streetName}}</span>'+
            '</li>'+
          '</ul>'+
          '<p ng-show="trueMode!=\'RAIL\' && (leg.steps.length==0 && selectedStep==leg)" class="direction-steps">'+
            '<span><em>{{leg.from.name}}</em> to <em>{{leg.to.name}}</em></span>'+
          '</p>'+
        '</div>'+
      '</div>',
    replace : true
  }
}]);