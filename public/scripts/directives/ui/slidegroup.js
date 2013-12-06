'use strict';

angular.module('uiModule').directive('slideGroup', ['$location','CommonAppState', function($location, CommonAppState){
	return {
		restrict : 'E',
		transclude : true,
		template :
			'<div ng-transclude>'+
				'</div>',
		scope : {
			selectedItem : '=selectedItem',
			selectedStop : '=selectedStop',
			selectedLine : '=selectedLine',
			showDetails: '=showDetails'
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
				slides.push(slide);
			}
		}],
		link: function($scope, $elm, $attr){
			var adjustScrollWidths =  function(){
				$('.group-list').css('width', width-2);
				$('.places-list').css('width', width-20);
				$('.steps-list').css('width', width);
			}

			var slideOut = function(callback){
				var width = $('.sidebar').width();
				$($elm).css('right', width+'px');
				$($elm).css('width', width+'px');	
				$('.container').addClass('adjust');
				$('.contact-desc').addClass('active');
				$('#trainmap').css('width', width);
				$('#trainmap').css('height', height-480);
				adjustScrollWidths();
			}

			var width = $('.sidebar').width();
			$($elm).css('width', width+'px');

			var height = $('.sidebar').height();

			var slideIn = function(callback){
				$($elm).css('right', '0px');
				$('.container').removeClass('adjust');
				$('.contact-desc').removeClass('active');
			}

			$(window).resize(function(){
				adjustScrollWidths();
			});

			$scope.$watch("selectedItem", function(newValue, oldValue){
				if(newValue === false && !($location.search()).li){
					slideIn();
				}else{
					if(!newValue.selected){
						slideIn();
					}else{
						if(newValue.stop){
							$scope.selectByTitle('Line');
							$scope.showDetails = true;
						}else{
							$scope.showDetails = false;
							$scope.selectByTitle(newValue.title);
						}
						slideOut();
					}
				}
			});

			$scope.$watch("selectedLine", function(newValue, oldValue){
				if(newValue){
					slideOut();
   				$scope.selectByTitle('Line');
					if($scope.selectedStop != null){
						$scope.showDetails = true;	
					}
				}
			});
		},
		replace: true
	}
}]);