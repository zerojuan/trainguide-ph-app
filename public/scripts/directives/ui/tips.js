'use strict';

angular.module('uiModule').directive('tips', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      tips : '=data'
    },
    link : function(scope){
      scope.clickedTip = function(tip){
        console.log('tip', tip);
        for(var i in scope.tips){
          scope.tips[i].selected = (scope.tips[i].title == tip) ? true : false;  
        }        
        console.log('selectedTip', scope.tips);
      };
    },
    template :
      '<div class="tips">'+
        '<ul>'+
          '<li ng-repeat="tip in tips" ng-click="clickedTip(tip.title)">'+
            '<h6>{{tip.title}}</h6>'+
            '<div ng-show="tip.selected" ng-hide="tip.selected==false">'+
              '<img src="{{tip.image}}" />'+
              '<p ng-repeat="detail in tip.details">{{detail}}</p>'+
            '</div>'+
          '</li>'+
        '</ul>'+
      '</div>',
    replace : true
  }
});