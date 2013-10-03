'use strict';

angular.module('uiModule').directive('slideGroup', ['CommonAppState', function(CommonAppState){
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
				// console.log("SLIDE: ", slide);
				//if(slides.length == 0) $scope.select(slide);
				slides.push(slide);
			}
		}],
		link: function($scope, $elm, $attr){
			var adjustScrollWidths =  function(){
				$('.group-list').css('width', width-2);
				$('.places-list').css('width', width-20);
				$('.steps-list').css('width', width);
			}

			var adjustScrollHeights = function(){
				$('.group-list').css('height', height-300);
			}

			var slideOut = function(callback){
				var width = $('.sidebar').width();
				// console.log('Sliding out:', width);
				$($elm).css('right', width+'px');
				$($elm).css('width', width+'px');	
				$('.container').addClass('adjust');
				$('.contact-desc').addClass('active');
				$('#trainmap').css('width', width);
				$('#trainmap').css('height', height-480);
				adjustScrollWidths();
				//adjustScrollHeights();
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
				//	adjustScrollHeights();
			});

			$scope.$watch("selectedItem", function(newValue, oldValue){
				// console.log("Selected Item Changed", newValue);
				if(newValue === false){
					slideIn();
				}else{
					if(!newValue.selected){
						slideIn();
					}else{
						if(newValue.stop){
							$scope.selectByTitle('Line');
							// $elm.find('#stop-content').show();
							// $elm.find('#line-content').hide();
							$scope.showDetails = true;
							// console.log('slidegroup.js selectedItem if(newValue.stop) showDetails: ', $scope.showDetails);
						}else{
							// $elm.find('#stop-content').hide();
							// $elm.find('#line-content').show();
							$scope.showDetails = false;
							$scope.selectByTitle(newValue.title);
							// console.log('slidegroup.js selectedItem else(newValue.stop) showDetails: ', $scope.showDetails);
						}
						slideOut();
					}
					// console.log('slidegroup.js selectedItem: ', $scope.selectedItem);
				}
			});

			$scope.$watch("selectedLine", function(newValue, oldValue){
				if(newValue){
					// console.log('slidegroup.js selectedLine newValue: ', newValue);
					slideOut();
					// $('.slide[title="Line"]').addClass('active');
   				$scope.selectByTitle('Line');
   				// console.log('slidegroup.js selectedLine slide', $scope.slides);
					// $elm.find('#stop-content').hide();
					// $elm.find('#line-content').show();
					// console.log('slidegroup.js selectedStop', $scope.selectedStop, 'selectedItem', $scope.selectedItem);
					if($scope.selectedStop != null){
						$scope.showDetails = true;	
					}
					// console.log('slidegroup.js selectedLine showDetails: ', $scope.showDetails);
				}
			});
		},
		replace: true
	}
}]);