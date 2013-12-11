'use strict';

angular.module('uiModule').directive('lineStops', ['$location', 'CommonAppState', 'StopsService', 
	function($location, CommonAppState, StopsService){
		return {
			restrict : 'E',
			transclude : true,
			scope : {
				selectedItem: '=selectedItem',
				selectedLine : '=selectedLine',
				selectedStop: '=selectedStop',
				showDetails: '=showDetails',
				transfers: '=transfers'
			},
			link : function(scope, element, attr){
				$('.preloader-container').fadeOut(function(){
					$(this).remove();
				});

				var y = null;
				var svgHeight = $(window).height() - 90;
				var svg = d3.select("#line-stop-svg").append("svg")
					.attr("class", "line-stop-chart")
					.attr("width", 260)
					.attr("height", svgHeight);
				// var lineWidth = 10;
				var lineWidth = 13;
				var centerX = 123;
				svg.append("rect")
					.attr("class", "vertical")
					.attr("x", centerX - lineWidth/2)
					.attr("width", lineWidth)
					.attr("y", 20);

				var paint = function(line){
					if(line && line.stops){
						$location.search('li', line.name);
						svg.selectAll(".label").remove();
						svg.selectAll(".stop").remove();
						svg.selectAll(".transfer").remove();
						svg.selectAll(".disabled").remove();
						// console.log('svgHeight', svgHeight, 'linestops: ', line.stops);
						y = d3.scale.linear()
									.domain([0, line.stops.length-1])
									.range([0, svgHeight-40]);

						for(var i in line.stops){
							svg.selectAll(".vertical")
								// .attr("height", svgHeight-30)
								.attr("height", function(d){
									if(line.name == "PNR"){
										return svgHeight-140	
									}
									return svgHeight-40
								})
								.attr("class", "vertical " + line.name);
							// svg.selectAll(".transfer").remove();
							
							var text = svg.selectAll(".label")
								.data(line.stops, function(d){return d.stop_id;});
							text.enter().append("text")
								.attr("class", function(d,i){
									var _class = "label";

									if(d.disabled){
										if(i < line.stops.length){
											svg.append("rect")
												.attr("class", "disabled")
												.attr("x", centerX - lineWidth/2)
												.attr("y", (y(i) - 5))
												.attr("width", lineWidth)
												.attr("height", (y(i+1) - y(i)));	
										}
										
									}
									if(i == 0 || i == line.stops.length-1){
										return _class + " ends";
									}
									return _class;
								})
								.attr("x", centerX - 17)
								.attr("y", function(d,i){return (y(i)+23)})
								.text(function(d,i){
									var name = d.details.stop_name;
									if(i == 0 || i == line.stops.length-1){
										name = d.details.stop_name.toUpperCase();
									}

									//remove last element
									var localNames = name.split(" ");
									localNames.pop();
									name = localNames.join(" ");

									if(name == "Cubao" || name == "Blumentritt"){
										name = d.details.stop_name;
									}

									if(d.transfer){
										var names = d.transfer.stop_name.split(" ");
										svg.append("text")
											.attr("class", "transfer")
											.attr("x", centerX + 40)
											.attr("y", (y(i)+23))
											.text(function(){
												if(names[0] == "Blumentritt" || names[0] == "Magellanes"){
													return names[0].toUpperCase();
												}
												return names[0].toUpperCase() + " " + names[1].toUpperCase();
											})
											.on("click", function(){
												scope.onSelectedStop(StopsService.getStopById(d.transfer.stop_id));
											});
										if(names.length > 1){
											// svg.append("text")
											// 	.attr("class", "transfer")
											// 	.attr("x", centerX + 40)
											// 	.attr("y", (y(i)+33))
											// 	.text(function(){
											// 		return names[1].toUpperCase();
											// 	});
											if(names[0] == "Blumentritt" || names[0] == "Magellanes"){
												svg.append("text")
													.attr("class", "transfer")
													.attr("x", centerX + 40)
													.attr("y", (y(i)+33))
													.text(function(){
														return names[1].toUpperCase();
													});
											}
											if(names[2]){
												svg.append("text")
													.attr("class", "transfer")
													.attr("x", centerX + 40)
													.attr("y", (y(i)+33))
													.text(function(){
														return names[2].toUpperCase();
													});
											}
										}
									}
									return name;
								})
								.on("click", function(d){
									scope.onSelectedStop(d);
								});
							text.exit().remove();
							var dots = svg.selectAll(".stop")
								.data(line.stops, function(d){return d.stop_id;});
							dots.enter().append("circle")
								.attr("class", function(d,i){
									var _class = "stop ";
									if(d.transfer){
										svg.append("rect")
											.attr("class", "transfer " + d.transfer.line_name)
											// .attr("x", centerX + 9)
											.attr("x", centerX + 13)
											// .attr("y", (y(i)+15))
											.attr("y", (y(i)+18))
											// .attr("width", 20)
											.attr("width", 10)
											// .attr("height", 10)
											.attr("height", 3)
											.attr("fill", "#333");
										svg.append("circle")
											.attr("class", "transfer " + d.transfer.line_name)
											.attr("cx", centerX+27)
											.attr("cy", (y(i)+20))
											.attr("r", 9)
											.on("click", function(){
												scope.onSelectedStop(StopsService.getStopById(d.transfer.stop_id));
											});
										return _class+= "transferee";
									}
									if(d.disabled){
										dots.append("rect")
											.attr("class", "disabled")
											.attr("x", centerX - lineWidth/2)
											.attr("y", (y(i)))
											.attr("width", lineWidth)
											.attr("height", y(i+1)+20);
										return _class += "disabled";
									}
									// return _class+= line.name;
									if(i == 0 || i == line.stops.length-1){
										return _class+= line.name;
									}
									return _class;
								})
								.attr("cx", centerX)
								.attr("cy", function(d,i){return y(i)+20})
								.attr("r", function(d,i){
									if(d.transfer){
										return 9;
									}
									if(i == 0 || i == line.stops.length-1){
										return 9;
									}
									return 4.5;
								})
								.on("click", function(d){
									scope.onSelectedStop(d);
								});
							dots.exit().remove();
							
						}
					}
				};

				scope.$watch('selectedLine', function(newValue, oldValue){
					paint(newValue);
				});

				scope.$watch('transfers', function(newVal, oldVal){
					paint(scope.selectedLine);	
				})

				scope.onSelectedStop = function(stop){
					for(var i in scope.selectedLine.stops){
						stop.line = scope.selectedLine.stops[i].details.stop_name;
					}
					console.log("BROADCASTING FROM LINESTOPS");
					scope.selectedStop = stop;
					scope.showDetails = true;
					scope.$apply();

					$location.search({li: scope.selectedLine.name, st: scope.selectedStop.stop_id});
				}

				scope.$watch('selectedStop', function(newValue, oldValue){
					if(scope.selectedLine){
						scope.showDetails = true;
					}
					if(scope.selectedStop == null){
						scope.showDetails = false;
					}
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
