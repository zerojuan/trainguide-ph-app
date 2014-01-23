'use strict';

angular.module('uiModule').directive('nearby', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selected : '=',
      selectedDest : '='
    },
    link : function(scope){
      scope.selectedNearby = "Places";
      scope.setNearby = function(choice){
        scope.selectedNearby = choice;
        console.log('selectedNearby', scope.selectedNearby);
      };
			function updateHideDiv(){
				// console.log("Hide DiV?");
				var selected = scope.selected;
				if((selected.hospital.data && selected.hospital.data.length > 0) ||
					(selected.hotel.data && selected.hotel.data.length > 0) ||
					(selected.office.data && selected.office.data.length > 0) ||
					(selected.sights.data && selected.sights.data.length > 0) ||
					(selected.shops.data && selected.shops.data.length > 0)){
					scope.hideDiv = true;
				}else{
					scope.hideDiv = false;
				}

				// console.log("HIDEDIV: " , scope.hideDiv);
			}

      scope.selectDest = function(dest){
        if(scope.selectedDest){
          scope.selectedDest.isSelected = false;
        }
        scope.selectedDest = dest;
        scope.selectedDest.isSelected = true;
        console.log('selectedDest!!!', scope.selectedDest);
      }

			scope.$watch("selected.hospital", function(newValue){
				updateHideDiv();
			}, true);
			scope.$watch("selected.hotel", function(newValue){
				updateHideDiv();
			}, true);
			scope.$watch("selected.office", function(newValue){
				updateHideDiv();
			}, true);
			scope.$watch("selected.sights", function(newValue){
				updateHideDiv();
			}, true);
			scope.$watch("selected.shops", function(newValue){
				updateHideDiv();
			}, true);
    },
    template :
      '<div ng-switch on="selectedNearby" class="nearby">'+
        '<ul>'+
          '<li ng-click="setNearby(\'Places\')" ng-class="{active:selectedNearby==\'Places\'}">'+
            '<a ng-click="setNearby(\'Places\')" target="_blank">Places</a>'+
          '</li>'+
          '<li ng-click="setNearby(\'Stops\')" ng-class="{active:selectedNearby==\'Stops\'}">'+
            '<a ng-click="setNearby(\'Stops\')" target="_blank">Stops</a>'+
          '</li>'+
        '</ul>'+
        '<div ng-switch-when="Places">'+
					'<div class="group-list">'+
						'<div ng-hide="hideDiv">'+
							'<h6></h6>'+
							'<p class="slideshow-content">No nearby places for this station in our database</p>'+
						'</div>'+
						'<placesbox title="Hospital" icon="icon-hospital" on-query-places="getLimitedPlaces" places="selected.hospital" category="Hospital" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>'+
						'<placesbox title="Hotel" icon="icon-hotel" on-query-places="getLimitedPlaces" places="selected.hotel" category="Hotel" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>'+
						'<placesbox title="Office" icon="icon-office" on-query-places="getLimitedPlaces" places="selected.office" category="Office" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>'+
						'<placesbox title="Sightseeing" icon="icon-sights" on-query-places="getLimitedPlaces" places="selected.sights" category="Sightseeing" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>'+
						'<placesbox title="Shopping" icon="icon-shopping" on-query-places="getLimitedPlaces" places="selected.shops" category="Shopping" stopname="selected.stop.details.stop_name" selected-dest="selected.dest"></placesbox>'+
					'</div>'+
        '</div>'+        
        '<div ng-switch-when="Stops">'+
          '<div class="group-list">'+
            '<div class="stops-box">'+
              '<div><h3>Nearby Stops</h3></div>'+
              '<ul>'+
                '<li ng-repeat="nearby in selected.nearbyStops" ng-class="{active:place.isSelected}">'+
                    '<a class="name" ng-click="selectDest(nearby)" target="_blank">{{nearby.stopName}}</a>'+
                    '<ul class="square">'+
                      '<li ng-repeat="routes in nearby.routes">'+
                        '<span>{{routes.route_long_name}}</span>'+
                      '</li>'+
                    '</ul>'+
                '</li>'+
              '</ul>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>',
    replace : true
  }
});