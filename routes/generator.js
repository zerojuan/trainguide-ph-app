
var constants = require('../constants'),
		qs = require("querystring"),
	  gtfs = require('gtfs-2'),
		request = require("request"),
		async = require('async'),
		fs = require("fs");

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
			sensor : true,
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

	//get route from each agency
	async.series([
		function(callback){
			findStops(constants.ROUTE_IDS.LRT1, function(result){
				trainLines.LRT1 = result;

				getPath(trainLines.LRT1, function(path){
					trainLines.LRT1.path = path;
					callback();
				});
			});
		},
		function(callback){
			findStops(constants.ROUTE_IDS.LRT2, function(result){
				trainLines.LRT2 = result;

				getPath(trainLines.LRT2, function(path){
					trainLines.LRT2.path = path;
					callback();
				});
			});
		},
		function(callback){
			findStops(constants.ROUTE_IDS.MRT, function(result){
				trainLines.MRT = result;

				getPath(trainLines.MRT, function(path){
					trainLines.MRT.path = path;
					callback();
				});
			});
		},
		function(callback){
			findStops(constants.ROUTE_IDS.PNR, function(result){
				trainLines.PNR = result;

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

		//construct a json file out of it
	});

}