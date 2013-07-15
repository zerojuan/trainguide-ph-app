'use strict';

angular.module('uiModule').directive('lineStops', ['CommonAppState', function(CommonAppState){
	return {
		restrict : 'E',
		transclude : true,
		scope : {selectedLine : '=selectedLine'},
		link : function(scope, element, attr){
			console.log(element);
			var svg = d3.select("#line-stop-svg").append("svg")
				.attr("class", "line-stop-chart")
				.attr("width", 300)
				.attr("height", 600);
			var lineWidth = 10;
			var centerX = 150;
			svg.append("rect")
				.attr("class", "vertical")
				.attr("x", centerX - lineWidth/2)
				.attr("width", lineWidth)
				.attr("y", 20);

			scope.$watch('selectedLine', function(newValue, oldValue){
				if(newValue && newValue.stopsData){
					svg.selectAll(".vertical")
						.attr("height", function(){return (newValue.stopsData.length-1) * 28})
						.attr("class", "vertical " + newValue.name);
					svg.selectAll(".transfer").remove();
					var dots = svg.selectAll(".stop")
						.data(newValue.stopsData, function(d){return d.id;});
					dots.enter().append("circle")
						.attr("class", function(d,i){
							var _class = "stop ";
							if(d.transfer){
								svg.append("rect")
									.attr("class", "transfer")
									.attr("x", centerX + 9)
									.attr("y", (28*i+15))
									.attr("width", 20)
									.attr("height", 10)
									.attr("fill", "#333");
								svg.append("circle")
									.attr("class", "transfer " + d.transfer.line)
									.attr("cx", centerX+25)
									.attr("cy", (28*i+20))
									.attr("r", 8);
								return _class+= "Transferee";
							}
							return _class+= newValue.name;
						})
						.attr("cx", centerX)
						.attr("cy", function(d,i){return (28*i)+20})
						.attr("r", function(d,i){
							if(d.transfer){
								return 8;
							}
							if(i == 0 || i == newValue.stopsData.length-1){
								return 8;
							}
							return 5;
						})
						.on("click", function(d){
							scope.selectedStop(d);
						});
					dots.exit().remove();
					var text = svg.selectAll(".label")
						.data(newValue.stopsData, function(d){return d.id;});
					text.enter().append("text")
						.attr("class", function(d,i){
							var _class = "label";
							if(d.transfer){
								var names = d.transfer.name.split(" ");
								svg.append("text")
									.attr("class", "transfer")
									.attr("x", centerX + 40)
									.attr("y", (28*i+23))
									.text(function(){
										return names[0].toUpperCase();
									});
								if(names.length > 1){
									svg.append("text")
										.attr("class", "transfer")
										.attr("x", centerX + 40)
										.attr("y", (28*i+33))
										.text(function(){
											return names[1].toUpperCase();
										});
								}
							}
							if(i == 0 || i == newValue.stopsData.length-1){
								return _class + " ends";
							}
							return _class;
						})
						.attr("x", centerX - 20)
						.attr("y", function(d,i){return (28*i+23)})
						.text(function(d,i){
							if(i == 0 || i == newValue.stopsData.length-1){
								return d.name.toUpperCase();
							}
							return d.name;
						});
					text.exit().remove();
				}
			});

			scope.selectedStop = function(stop){
				console.log("Selected Stop ", stop);
				stop.line = scope.selectedLine.name;
				CommonAppState.prepForBroadcast("selectedStop", stop);
			}
		},
		template :
			'<div class="line-stops" ng-transclude>'+
				'<div id="line-stop-svg">'+
				'</div>'+
				'</div>',
		replace : true
	}
}]);
