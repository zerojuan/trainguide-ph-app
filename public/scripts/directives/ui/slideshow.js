'use strict';

angular.module('uiModule').directive('slideshow', [function(){
	return {
		restrict : 'E',
		transclude : true,
		scope : {images : '=images'},
		link : function(scope, element, attr){
			scope.$watch("images", function(newValue, oldValue){
				if(newValue){
					scope.theImage = newValue[0];
				}
			});
		},
		template :
			'<div class="images-box slideshow" ng-transclude>'+
				'<h3>Photos</h3>'+
				'<div class="slideshow-content">' +
				'<div class="main-img"><img src="{{theImage}}"></img></div>'+
				'<ul class="sub-image">' +
				'<li ng-repeat="img in images" >'+
				'<div class="image-group">'+
				'<img ng-show="theImage != img" src="{{img}}"></img>'+
				'</div>'+
				'</li>' +
				'</ul>'+
				'</div>' +
				'</div>',
		replace : true

	}
}]);