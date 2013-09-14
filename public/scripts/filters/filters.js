(function(){

	angular.module("trainguide.filters")
		.filter('realmode', function(){
			return function(mode, routeId){
				if(mode == 'BUS') {
					if(routeId.indexOf('PUJ') >= 0) {
						return 'JEEP';
					}
					else {
						return 'BUS';
					}
				}
				else {
					return mode;
				}
			}
		})
		.filter('tominutes', function(){
			return function(millis){
				return Math.round((millis/1000)/60);
			}
		});
})();