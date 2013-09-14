
angular.module('google-maps')
	.directive('placesAutocomplete', ['$rootScope', function($rootScope){
		return {
			restrict: 'A',
			scope: {
				place: '='
			},
			link: function(scope, elm, attrs){
				var autocomplete = new google.maps.places.Autocomplete(elm[0]);

				$rootScope.$watch('map', function(newVal, oldVal){
					if(newVal){
						//create autocomplete object here
						autocomplete.bindTo('bounds', newVal);
					}
				});

				google.maps.event.addListener(autocomplete, 'place_changed', function(){
					var place = autocomplete.getPlace();
					if(!place.geometry){
						//cannot find place, maybe it's a latlng?
						return;
					}
					scope.place = place;
					scope.$apply();
				});
			}
		}
	}]);