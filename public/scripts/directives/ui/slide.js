'use strict';

angular.module('uiModule').directive('slide', [function(){
	return {
		require : '^slideGroup',
		restrict : 'E',
		transclude : true,
		scope : { title : '@'},
		link: function(scope, element, attrs, slideGroup) {
			slideGroup.addSlide(scope);
		},
		template :
			'<div class="slide" ng-class="{active:selected}" ng-transclude></div>',
		replace : true
	}
}]);