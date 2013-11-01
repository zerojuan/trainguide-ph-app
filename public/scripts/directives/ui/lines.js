'use strict';

angular.module('uiModule').directive('lines', ['CommonAppState', function(CommonAppState){
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			lines : '=',
			selectedStop : '=',
			selectedLine : '=',
			showDetails : '=',
			getLineDetails : '='
		},
		link : function(scope, element){
				console.log('lines.js selectedStop', scope.selectedStop);
			scope.$watch("selectedStop", function(newValue, oldValue){
				if(newValue){
					element.find('.stop-desc').html('<h2>'+newValue.details.stop_name+'</h2>');
					// element.find('.line-desc').hide();
				}//else{
				// 	element.find('.line-desc').show();
				// 	element.find('.stop-desc').hide();
				// }
				// console.log('lines.js selectedStop', scope.selectedStop);
			});

			scope.lineSelected = function(line){
				// console.log('Selected: ', line);
				scope.selectedLine = line;
				scope.selectedStop = null;
				scope.showDetails = false;
				scope.getLineDetails(line);
				// console.log('lines.js selectedStop showDetails: ', scope.showDetails);
			}
		},
		template :
			'<div class="line-nav clearfix {{selectedLine.name}}" ng-transclude>'+
				'<ul>'+
					'<li ng-repeat="i in lines" class="{{i.name}}" ng-class="{active:i.name == selectedLine.name}" ng-click="lineSelected(i)">'+
						'{{i.shortName}}'+
					'</li>'+
				'</ul>'+
				'<div class="stop-desc" ng-class="{true:\'showdetails\', false:\'nodetails\'}[showDetails]"></div>'+
				'<table class="line-desc" ng-class="{true:\'nodetails\', false:\'showdetails\'}[showDetails]">'+
					'<tr>'+
						'<td>Weekdays: {{selectedLine.details.weekdays}}</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Weekend: {{selectedLine.details.weekend}}</td>'+
					'</tr>'+
					'<tr ng-show="selectedLine.details.svc">'+
						'<td>Stored Value Card: {{selectedLine.details.svc}}</td>'+
					'</tr>'+
				'</table>'+
//				'<table class="contact-desc" ng-class="{true:\'nodetails\', false:\'showdetails\'}[showDetails]">'+
//					'<th>Contact</th>'+
//					'<tr>'+
//						'<td>Web: {{selectedLine.details.web}}</td>'+
//					'</tr>'+
//					'<tr>'+
//						'<td>Twitter: {{selectedLine.details.twitter}}</td>'+
//					'</tr>'+
//					'<tr>'+
//						'<td>Contact No.: {{selectedLine.details.contactNo}}</td>'+
//					'</tr>'+
//					'<tr>'+
//						'<td>Fare: {{selectedLine.details.fare}}</td>'+
//					'</tr>'+
//					'<tr>'+
//						'<td>Email: {{selectedLine.details.email}}</td>'+
//					'</tr>'+
//				'</table>'+
			'</div>',
		replace : true
	}
}]);