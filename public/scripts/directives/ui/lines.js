'use strict';

angular.module('uiModule').directive('lines', ['CommonAppState', function(CommonAppState){
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			lines : '=lines',
			selectedStop : '=selectedStop',
			selectedLine : '=selectedLine',
			showDetails: '=showDetails'
		},
		link : function(scope, element){
			scope.$watch("selectedStop", function(newValue, oldValue){
				if(newValue){
					element.find('.stop-desc').html('<h2>'+newValue.details.stop_name+'</h2>');
					// element.find('.line-desc').hide();
				}//else{
				// 	element.find('.line-desc').show();
				// 	element.find('.stop-desc').hide();
				// }
				console.log('lines.js selectedStop', scope.selectedStop);
			});

			scope.lineSelected = function(line){
				// console.log('Selected: ', line);
				scope.selectedLine = line;
				scope.selectedStop = null;
				scope.showDetails = false;
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
				'<td>Weekdays: {{selectedLine.weekdays}}</td>'+
				'<td>Web: {{selectedLine.web}}</td>'+
				'</tr>'+
				'<tr>'+
				'<td>Weekend: {{selectedLine.weekend}}</td>'+
				'<td>Twitter: {{selectedLine.twitter}}</td>'+
				'</tr>'+
				'<tr>'+
				'<td>Contact No.: {{selectedLine.contactNo}}</td>'+
				'<td>Fare: {{selectedLine.fare}}</td>'+
				'</tr>'+
				'<tr>'+
				'<td>Email: {{selectedLine.email}}</td>'+
				'<td>Stored Value Card: {{selectedLine.svc}}</td>'+
				'</tr>'+
				'</table>'+
				'</div>',
		replace : true
	}
}]);