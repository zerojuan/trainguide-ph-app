
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

				elm.bind("keyup", function(){
					console.log("VALUE: " + elm.val());
					if(elm.val() == ""){
						scope.place = null;
						scope.$apply("place");
					}
				});

				google.maps.event.addListener(autocomplete, 'place_changed', function(){
					var place = autocomplete.getPlace();
					if(!place.geometry){
						//cannot find place, maybe it's a latlng?
						console.log("Cannot find place");
						return;
					}
					scope.place = place;
					scope.$apply();
				});

				scope.$watch('place', function(newVal){
					console.log('New Place update!', newVal);
					if(newVal)
						elm.val(newVal.formatted_address);
				});
			}
		}
	}]);