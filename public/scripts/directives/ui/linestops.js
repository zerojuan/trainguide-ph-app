'use strict';

angular.module('uiModule').directive('lineStops', ['CommonAppState', function(CommonAppState){
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			selectedItem: '=selectedItem',
			selectedLine : '=selectedLine',
			selectedStop: '=selectedStop',
			showDetails: '=showDetails'
		},
		link : function(scope, element, attr){
			// console.log(element);
			var y = null;
			var svgHeight = $(window).height() - 130;
			var svg = d3.select("#line-stop-svg").append("svg")
				.attr("class", "line-stop-chart")
				.attr("width", 260)
				.attr("height", svgHeight);
			var lineWidth = 10;
			var centerX = 130;
			svg.append("rect")
				.attr("class", "vertical")
				.attr("x", centerX - lineWidth/2)
				.attr("width", lineWidth)
				.attr("y", 20);

			scope.$watch('selectedLine', function(newValue, oldValue){
				// console.log('SELECTEDITEM!!!!!', scope.selectedItem);
				if(newValue && newValue.stops){
					// console.log('svgHeight', svgHeight, 'linestops: ', newValue.stops);
					y = d3.scale.linear()
								.domain([0, newValue.stops.length-1])
								.range([0, svgHeight-30]);

					for(var i in newValue.stops){
						svg.selectAll(".vertical")
							.attr("height", svgHeight-30)
							.attr("class", "vertical " + newValue.name);
						svg.selectAll(".transfer").remove();
						var dots = svg.selectAll(".stop")
							.data(newValue.stops, function(d){return d.stop_id;});
						dots.enter().append("circle")
							.attr("class", function(d,i){
								var _class = "stop ";
								if(d.transfer){
									svg.append("rect")
										.attr("class", "transfer")
										.attr("x", centerX + 9)
										.attr("y", (y(i)+15))
										.attr("width", 20)
										.attr("height", 10)
										.attr("fill", "#333");
									svg.append("circle")
										.attr("class", "transfer " + d.transfer.line)
										.attr("cx", centerX+25)
										.attr("cy", (y(i)+20))
										.attr("r", 8);
									return _class+= "Transferee";
								}
								return _class+= newValue.name;
							})
							.attr("cx", centerX)
							.attr("cy", function(d,i){return y(i)+20})
							.attr("r", function(d,i){
								if(d.transfer){
									return 8;
								}
								if(i == 0 || i == newValue.stops.length-1){
									return 8;
								}
								return 5;
							})
							.on("click", function(d){
								scope.onSelectedStop(d);
							});
						dots.exit().remove();
						var text = svg.selectAll(".label")
							.data(newValue.stops, function(d){return d.stop_id;});
						text.enter().append("text")
							.attr("class", function(d,i){
								var _class = "label";
								if(d.transfer){
									var names = d.transfer.details.stop_name.split(" ");
									svg.append("text")
										.attr("class", "transfer")
										.attr("x", centerX + 40)
										.attr("y", (y(i)+23))
										.text(function(){
											return names[0].toUpperCase();
										});
									if(names.length > 1){
										svg.append("text")
											.attr("class", "transfer")
											.attr("x", centerX + 40)
											.attr("y", (y(i)+33))
											.text(function(){
												return names[1].toUpperCase();
											});
									}
								}
								if(i == 0 || i == newValue.stops.length-1){
									return _class + " ends";
								}
								return _class;
							})
							.attr("x", centerX - 20)
							.attr("y", function(d,i){return (y(i)+23)})
							.text(function(d,i){
								if(i == 0 || i == newValue.stops.length-1){
									return d.details.stop_name.toUpperCase();
								}
								return d.details.stop_name;
							});
						text.exit().remove();
					}
				}
			});

			scope.onSelectedStop = function(stop){
				// console.log("Selected Stop ", stop, 'scope.selectedLine.stops', scope.selectedLine.stops);
				for(var i in scope.selectedLine.stops){
					stop.line = scope.selectedLine.stops[i].details.stop_name;	
					// console.log('stop', stop, 'stop.line', stop.line);
				}
				console.log("BROADCASTING FROM LINESTOPS");
				scope.selectedStop = stop;
				// console.log("SELECTED Stop", scope.selectedStop);
				//CommonAppState.prepForBroadcast("selectedStop", stop);
				scope.showDetails = true;
				// console.log('linestops.js onSelectedStop showDetails: ', scope.showDetails);
				scope.$apply();
			}

			scope.$watch('selectedStop', function(newValue, oldValue){
				// console.log("Selected stop changed");
				// console.log('SELECTED LINE!!!!!!!!!!!!!!', scope.selectedLine, 'selectedStop', scope.selectedStop);
				if(scope.selectedLine){
					scope.showDetails = true;
				}
				if(scope.selectedStop == null){
					scope.showDetails = false;
				}
				// console.log('linestops.js selectedStop: ', scope.selectedStop);
			});
		},
		template :
			'<div class="line-stops" ng-transclude>'+
				'<div id="line-stop-svg">'+
				'</div>'+
				'</div>',
		replace : true
	}
}]);
