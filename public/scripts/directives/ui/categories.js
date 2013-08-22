'use strict';

angular.module('uiModule').directive('categories', ['CommonAppState', function(CommonAppState){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedItem : '=',
			onQueryPlaces : '=',
			places : '='
    },
    link : function(scope, element){
      console.log('scope.selectedItem', scope.selectedLine);
      scope.$watch("selectedItem", function(newValue, oldValue){
        if(newValue.title == 'Places'){
          var qry = {
              format: 'json',
              queryStr: 'hospital'
          }
					scope.onQueryPlaces(qry);
        }
      });
    },
    template :
      '<div>' +
				'<ul>' +
				'	<li ng-repeat="place in places">' +
				'		<p>{{place.name}}</p>' +
				'</li>' +
				'</ul>' +
			'</div>',
    replace : true
  }
}]);