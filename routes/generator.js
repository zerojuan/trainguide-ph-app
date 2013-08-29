
var constants = require('../constants'),
		qs = require('querystring'),
	  gtfs = require('gtfs-2'),
		request = require('request'),
		async = require('async'),
		fs = require('fs');

var LineDetails = require('../models/linedetails');

exports.insertAdditionalData = function(req, res, next){
//	constants.ROUTE_IDS.LRT1;
//	constants.ROUTE_IDS.LRT2;
//	constants.ROUTE_IDS.MRT;
//	constants.ROUTE_IDS.PNR;

	var insertDetails = function(routeId, details){
		var lineDetails = new LineDetails();

		lineDetails.route_id = routeId;
		lineDetails.weekdays = details.weekdays;
		lineDetails.weekend = details.weekend;
		lineDetails.contact = details.contact;
		lineDetails.email = details.email;
		lineDetails.fare = details.fare;
		lineDetails.svc = details.svc;
		lineDetails.twitter = details.twitter;
		lineDetails.web = details.web;

		lineDetails.save(function(err){
			if(err) return next(err);
			console.log('Success saving details: ' + routeId);
		})
	};

	var insertTransfers = function(transferArray){
		//find stop with given name
		var stopA = transferArray[0];
		var stopB = transferArray[1];

		var insertTransfer = function(stop, transfer){
			var transfer = new gtfs.Transfer();

			transfer.agency_key = getAgencyKey(stop.line);
			transfer.from_stop_id = stop.stop_id;
			transfer.to_stop_id = transfer.stop_id;
			transfer.transfer_type = '1';
			transfer.min_transfer_time = '15min';

			transfer.save(function(err){
				if(err) return next(err);
				console.log('Success saving transfer: StopId: ' + stop.stop_id);
			});
		};

		var getAgencyKey = function(routeId){
			if(routeId == constants.ROUTE_IDS.PNR){
				return 'PNR';
			}else if(routeId == constants.ROUTE_IDS.MRT){
				return 'MRTC';
			}else if(routeId == constants.ROUTE_IDS.LRT1 || routeId == constants.ROUTE_IDS.LRT2){
				return 'LRTA';
			}
		};

		insertTransfer(stopA, stopB);
		insertTransfer(stopB, stopA);
	};

	var transfers = [
		[{name: 'EDSA PNR', stop_id: 'LTFRB_5001', line: constants.ROUTE_IDS.PNR}, {name: 'Magallanes MRT', stop_id: 'LTFRB_4975', line: constants.ROUTE_IDS.MRT}],
		[{name: 'Santa Mesa PNR', stop_id: 'LTFRB_4999', line: constants.ROUTE_IDS.PNR}, {name: 'Pureza LRT', stop_id: 'LTFRB_4979', line: constants.ROUTE_IDS.LRT2}],
		[{name: 'Blumentritt PNR', stop_id: 'LTFRB_4991', line: constants.ROUTE_IDS.PNR}, {name: 'Blumentritt LRT', stop_id: 'LTFRB_4957', line: constants.ROUTE_IDS.LRT2}],
		[{name: 'Doroteo Jose LRT', stop_id: 'LTFRB_4954', line: constants.ROUTE_IDS.LRT1}, {name: 'Recto LRT', stop_id: 'LTFRB_4977', line: constants.ROUTE_IDS.LRT2}],
		[{name: 'EDSA LRT', stop_id: 'LTFRB_4945', line: constants.ROUTE_IDS.LRT1}, {name: 'Taft MRT', stop_id: 'LTFRB_4976', line: constants.ROUTE_IDS.MRT}],
		[{name: 'Cubao LRT', stop_id: 'LTFRB_4984', line: constants.ROUTE_IDS.LRT2}, {name: 'Cubao MRT', stop_id: 'LTFRB_4967', line: constants.ROUTE_IDS.MRT}]
	];

	for(var i = 0; i < transfers.length; i++){
		insertTransfers(transfers[i]);
	}


	//insert to Route data
	var misc = [
		{line: constants.ROUTE_IDS.LRT1, details: {
			weekdays: '5am to 9:30pm',
			weekend: '5am to 9:00pm',
			contact: '853-0041 to 60',
			email: 'lrtamain@lrta.gov.ph',
			fare: 'P12-P20',
			svc: 'P100',
			twitter: '@attycabs',
			web: 'www.lrta.gov.ph'
		}},
		{line: constants.ROUTE_IDS.LRT2, details: {
			weekdays: '5am to 9:30pm',
			weekend: '5am to 9:00pm',
			contact: '647-3479 to 91',
			email: 'lrtamain@lrta.gov.ph',
			fare: 'P12-P15',
			svc: 'P100',
			twitter: '',
			web: 'www.lrt2.com'
		}},
		{line: constants.ROUTE_IDS.MRT, details: {
			weekdays: '5:30am to 10pm',
			weekend: '5:30am to 10pm',
			contact: '',
			email: '',
			fare: 'P10-P15',
			svc: 'P100',
			twitter: '@dotcmrt3',
			web: 'www.dotcmrt3.weebly.com'
		}},
		{line: constants.ROUTE_IDS.PNR, details: {
			weekdays: '5:05am to 6:30pm',
			weekend: '5:05am to 6:30pm',
			contact: '319-0045',
			email: '',
			fare: 'P10-P15',
			svc: 'P100',
			twitter: '@PNRRailways',
			web: 'www.pnr.gov.ph'
		}}
	];

	for(var i = 0; i < misc.length; i++){
		insertDetails(misc[i].line, misc[i].details);
	}

	res.send({
		status: 'OK'
	});
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
										description: route.route_desc,
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
//		var transfers = [
//			[{name: 'EDSA PNR', line: trainLines.PNR}, {name: 'Magallanes MRT', line: trainLines.MRT}],
//			[{name: 'Santa Mesa PNR', line: trainLines.PNR}, {name: 'Pureza LRT', line: trainLines.LRT2}],
//			[{name: 'Blumentritt PNR', line: trainLines.PNR}, {name: 'Blumentritt LRT', line: trainLines.LRT2}],
//			[{name: 'Doroteo Jose LRT', line: trainLines.LRT1}, {name: 'Recto LRT', line: trainLines.LRT2}],
//			[{name: 'EDSA LRT', line: trainLines.LRT1}, {name: 'Taft MRT', line: trainLines.MRT}],
//			[{name: 'Cubao LRT', line: trainLines.LRT2}, {name: 'Cubao MRT', line: trainLines.MRT}]
//		];
//
//		//insert the transfers
//		for(var i in transfers){
//			var transfer = transfers[i];
//			insertTransfer(transfer);
//		}

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