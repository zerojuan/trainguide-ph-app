'use strict';

angular.module('uiModule').directive('route', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      trip : '=',
      isselected: '&'
    },
    template :
      '<div ng-class="{selectedroute: isselected() == true}">'+
        '<span>{{trip.duration|tominutes}} minutes</span>'+
      '</div>',
    replace : true
  }
});