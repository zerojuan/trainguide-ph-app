
var constants = require('../constants'),
		qs = require('querystring'),
	  gtfs = require('gtfs-2'),
		request = require('request'),
		async = require('async'),
		fs = require('fs');

exports.insertAdditionalData = function(req, res, next){
//	constants.ROUTE_IDS.LRT1;
//	constants.ROUTE_IDS.LRT2;
//	constants.ROUTE_IDS.MRT;
//	constants.ROUTE_IDS.PNR;

	var insertDetails = function(routeId, details){
		gtfs.Route.findOne({route_id: routeId}, function(err, route){
			if(err){
				next(err);
			};

			route.details = details;
			route.save();
		});
	}

	var transfers = [
		[{name: 'EDSA PNR', line: 'PNR'}, {name: 'Magallanes MRT', line: 'MRT'}],
		[{name: 'Santa Mesa PNR', line: 'PNR'}, {name: 'Pureza LRT', line: 'LRT2'}],
		[{name: 'Blumentritt PNR', line: 'PNR'}, {name: 'Blumentritt LRT', line: 'LRT2'}],
		[{name: 'Doroteo Jose LRT', line: 'LRT1'}, {name: 'Recto LRT', line: 'LRT2'}],
		[{name: 'EDSA LRT', line: 'LRT1'}, {name: 'Taft MRT', line: 'MRT'}],
		[{name: 'Cubao LRT', line: 'LRT2'}, {name: 'Cubao MRT', line: 'MRT'}]
	];




	//insert to Route data
	var misc = [
		{line: constants.ROUTE_IDS.LRT1, details: {}},
		{line: constants.ROUTE_IDS.LRT2, details: {}},
		{line: constants.ROUTE_IDS.MRT, details: {}},
		{line: constants.ROUTE_IDS.PNR, details: {}}
	];

	for(var i = 0; i < misc.length; i++){
		insertDetails(misc[i].line, misc[i].details);
	}
}

exports.generateStaticData = function(req, res, next){
	var trainAgencies = constants.AGENCIES;
	var trainLines = {};

	var findStops = function(routeId, callback){
		gtfs.Route.findOne({route_id: routeId}, function(err, route){
			if(err){
				next(err);
			}
			gtfs.Trip.find({ route_id: routeId}, function(err, trips){
				if(trips){
					var trip = trips[0];
					gtfs.StopTime.find({ trip_id: trip.trip_id }, null, { sort: 'stop_sequence' }, function(err, stoptimeData){
						if(stoptimeData != null){
							async.map(stoptimeData, function(stopObj, next){
								var stop = stopObj.toObject();
								gtfs.Stop.findOne({ stop_id: stopObj.stop_id }, function(err, stopData){
									if(stopData != null){
										stop.details = stopData;
									}
									next(err, stop);
								});
							},function(err, result){
								if(err){
									callback(err);
								}else{
									var resultObj = {
										shortName: route.route_short_name,
										longName: route.route_long_name,
										description: route.route_description,
										url: route.route_url,
										details: route.details,
										stops: result
									}
									callback(resultObj);
								}
							});
						}
					});
				}
			});
		});
	}

	var buildPath = function(origin, dest, departureTime){
		var args = {
			origin : origin,
			destination : dest,
			mode : 'transit',
//			sensor : true,
			departure_time : departureTime
		};
		return qs.stringify(args);
	}

	var getDirections = function(origin, dest, callback){
		var origin = origin.lat+','+origin.lng
		var destination =dest.lat+','+dest.lng;
		var date = new Date();
		var path = buildPath(origin, destination, Math.round(date.getTime()/1000));

		var options = {
			uri: 'https://maps.googleapis.com/maps/api/directions/json?' + path
		};

		console.log(options.uri);

		request(options, function (error, res, data) {
			if (error) {
				console.log(error)
			}
			data = JSON.parse(data);
			if(data.status != 'OK'){
				console.log(data.status);
			}else{
				var points = data.routes[0].overview_polyline.points;

				callback(points);
			}
		});
	};

	var getPath = function(line, callback){
		var startStop = line.stops[0];
		var endStop = line.stops[line.stops.length-1];

		var origin = {
			lat: startStop.details.stop_lat,
			lng: startStop.details.stop_lon
		};

		var dest = {
			lat: endStop.details.stop_lat,
			lng: endStop.details.stop_lon
		};

		getDirections(origin, dest, callback);
	}

	var searchStationByName = function(stationData){
		var line = stationData.line;

		for(var i = 0; i < line.stops.length; i++){
			if(line.stops[i].details.stop_name == stationData.name){
				return line.stops[i];
			}
		}
	}

	var insertTransfer = function(transfer){
		var stationA, stationB;

		stationA = searchStationByName(transfer[0]);
		stationB = searchStationByName(transfer[1]);

		stationA.transfer = {
			name: stationB.details.stop_name,
			_id: stationB._id
		};

		stationB.transfer = {
			name: stationA.details.stop_name,
			_id: stationA._id
		};
	}

	//get route from each agency
	async.series([
		function(callback){
			findStops(constants.ROUTE_IDS.LRT1, function(result){
				trainLines.LRT1 = result;

				//TODO: insert additional data here

				getPath(trainLines.LRT1, function(path){
					trainLines.LRT1.path = path;
					callback();
				});
			});
		},
		function(callback){
			findStops(constants.ROUTE_IDS.LRT2, function(result){
				trainLines.LRT2 = result;

				//TODO: insert additional data here

				getPath(trainLines.LRT2, function(path){
					trainLines.LRT2.path = path;
					callback();
				});
			});
		},
		function(callback){
			findStops(constants.ROUTE_IDS.MRT, function(result){
				trainLines.MRT = result;

				//TODO: insert additional data here

				getPath(trainLines.MRT, function(path){
					trainLines.MRT.path = path;
					callback();
				});
			});
		},
		function(callback){
			findStops(constants.ROUTE_IDS.PNR, function(result){
				trainLines.PNR = result;

				//TODO: insert additional data here

				getPath(trainLines.PNR, function(path){
						trainLines.PNR.path = path;
						callback();
				});
			});
		}
	],
	function(err, results){
		//get array of stops from each route
		console.log(trainLines);

		var outputFilename = './public/data/lines.data.json';

		//insert the transfers here
		var transfers = [
			[{name: 'EDSA PNR', line: trainLines.PNR}, {name: 'Magallanes MRT', line: trainLines.MRT}],
			[{name: 'Santa Mesa PNR', line: trainLines.PNR}, {name: 'Pureza LRT', line: trainLines.LRT2}],
			[{name: 'Blumentritt PNR', line: trainLines.PNR}, {name: 'Blumentritt LRT', line: trainLines.LRT2}],
			[{name: 'Doroteo Jose LRT', line: trainLines.LRT1}, {name: 'Recto LRT', line: trainLines.LRT2}],
			[{name: 'EDSA LRT', line: trainLines.LRT1}, {name: 'Taft MRT', line: trainLines.MRT}],
			[{name: 'Cubao LRT', line: trainLines.LRT2}, {name: 'Cubao MRT', line: trainLines.MRT}]
		];

		//insert the transfers
		for(var i in transfers){
			var transfer = transfers[i];
			insertTransfer(transfer);
		}

		//get shape data from each array of stops

		fs.writeFile(outputFilename, JSON.stringify(trainLines, null, 4), function(err){
			if(err){
				console.log(err);
				res.send(404, err);
			}else{
				console.log('JSON Saved to ' + outputFilename);
				res.send({
					status: 'OK'
				});
			}
		});
	});

}