'use strict';

angular.module('uiModule').directive('slideGroup', [function(){
	return {
		restrict : 'E',
		transclude : true,
		template :
			'<div ng-transclude>'+
				'</div>',
		scope : {
			selectedItem : '=selectedItem'
		},
		controller : ['$scope', '$element', function($scope, $element){
			var slides = $scope.slides = [];

			$scope.selectByTitle = function(title){
				angular.forEach(slides, function(slide){
					if(slide.title == title){
						slide.selected = true;
					}else{
						slide.selected = false;
					}
				})
			}

			$scope.select = function(slide){
				angular.forEach(slides, function(slide){
					slide.selected = false;
				});
				slide.selected = true;
			}

			this.addSlide = function(slide){
				console.log("SLIDE: ", slide);
				//if(slides.length == 0) $scope.select(slide);
				slides.push(slide);
			}
		}],
		link: function($scope, $elm, $attr){
			var slideOut = function(callback){
				var width = $('.sidebar').width();
				console.log('Sliding out:', width);
				$($elm).css('right', width+'px');
				$($elm).css('width', width+'px');
			}

			var width = $('.sidebar').width();
			$($elm).css('width', width+'px');

			var slideIn = function(callback){
				$($elm).css('right', '0px');
			}

			$scope.$watch("selectedItem", function(newValue, oldValue){
				console.log("Selected Item Changed", newValue);
				if(newValue === false){
					slideIn();
				}else{
					if(!newValue.selected){
						slideIn();
					}else{
						if(newValue.stop){
							$scope.selectByTitle('Line');
							$elm.find('#stop-content').show();
							$elm.find('#line-content').hide();
						}else{
							$elm.find('#stop-content').hide();
							$elm.find('#line-content').show();
							$scope.selectByTitle(newValue.title);
						}
						slideOut();
					}
				}
			});
		},
		replace: true
	}
}]);