'use strict';

angular.module('uiModule').directive('placesbox', function(){
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			title : '@',
			icon : '@',
			onQueryPlaces : '=',
			places : '=',
			category : '=',
			stopname : '=',
			selectedDest : '='
		},
		link : function(scope, element, attr){
			var limit = 5;
			scope.$watch('places', function(){
				console.log("Places value: ", scope.places);
			}, true);

			scope.loadPlaces = function(counter){
				var qry = {
					limit: limit,
					start: (counter*limit),
					category: scope.category,
					stopname: scope.stopname
				}
				console.log('shops qry', qry);
				scope.onQueryPlaces(qry);
				$('.antiscroll-wrap').antiscroll();
			}

			scope.selectDest = function(dest){
				scope.selectedDest = dest;
				console.log('selectedDest!!!', scope.selectedDest);
			}
		},
		template :
			'<div class="places-box">'+
				'<div><h3>{{title}}</h3><i class="{{icon}}"></i></div>'+
				'<ul>'+
					'<li ng-repeat="place in places.data">'+
						'<a ng-click="selectDest(place)" target="_blank">'+
							'<span class="name">{{place.name}}</span>'+
							'<span class="distance">{{place.distance}}</span>'+
						'</a>'+
					'</li>'+
					'<li ng-show="!places.data.length">No sights near the area.</li>'+
				'</ul>'+
				'<a ng-show="places.counter*5<=places.totalcount-5" ng-click="loadPlaces(places.counter+1)">More...</a>'+
			'</div>',
		replace : true
	}
});