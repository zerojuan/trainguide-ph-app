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
		})
		.filter('parseDirection', function(){
			return function(direction){
				if(direction.indexOf('_')){
					return direction.replace('_', ' ');
				}
			}
		})
		.filter('lineCode', function(){
			return function(line){
				if(line){
					var code;
	        switch(line){
	          case 'LRT 1':
	            code = 'LRT1';
	            break;
	          case 'LRT 2':
	            code = 'LRT2';
	            break;
	          case 'MRT-3':
	            code = 'MRT';
	            break;
	          default:
	            code = 'PNR';
	            break;
	        }
	        return code;
	      }
			}
		});
})();