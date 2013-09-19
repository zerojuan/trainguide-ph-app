'use strict';

angular.module('uiModule').directive('direction', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      leg : '='
    },
    link : function(scope){
      $('.antiscroll-wrap').antiscroll();
    },
    template :
      '<div>'+
        '<div class="{{leg.mode|realmode:leg.routeId}}">'+
          '<p>{{leg.mode|realmode:leg.routeId}}</p>'+
          '<p><em>{{leg.from.name}}</em> to <em>{{leg.to.name}}</em></p>'+
        '</div>'+
      '</div>',
    replace : true
  }
});