
var gtfs = require('gtfs-2');
var async = require('async');

module.exports = {
	agencies: {
		list: function(req, res){
			//RETURN LIST OF AGENCIES
			console.log('agencies.list!!!');
			gtfs.agencies(function(e, data){
				// console.log("Values: ", e, data);
	      res.send(data || {error: 'No agencies in database'});
	    });
		},
		get: function(req, res){
			//RETURN AGENCY DATA
			console.log('agencies.get!!!');
			var agency = req.agency;
			// console.log('agency', agency);
			res.send(agency || res.error);
		}
	},
	routes: {
		list: function(req, res){
			//GET ROUTES FROM SPECIFIC AGENCY
			console.log('routes.list!!!');
			var agency = req.agency;
			if(agency != null){
				console.log('agency', agency);
				gtfs.Route.find({ agency_id: agency.agency_id }, function(err, data){
					console.log('routes data', data);
					if(data)
		      	res.send(data);	
		    });	
			}else{
				res.send({error: 'Incorrect agency_id'});
			}
		},
		get: function(req, res){
			//RETURN AGENCY DATA
			console.log('routes.get!!!');
			var route = req.routeId;
			res.send(route || res.error);
		}
	},
	trips: {
		list: function(req, res){
			console.log('trips.list!!!');
			var route = req.routeId;
			// console.log(route);
			if(route != null){
				gtfs.Trip.find({ route_id: route.route_id }, function(err, trips){
					// console.log('ERR', err);
					// console.log('trip data', data);
					if(trips){
						async.map(trips, function(trip, next){
							gtfs.Calendar.findOne({service_id: trip.service_id}, function(err, calendar){
								var locTrip = trip.toObject();
								if(calendar){
									locTrip.calendar = calendar;
									locTrip.test = 1;
									console.log("Adding calendar...", locTrip);
								}
								next(err, locTrip);
							});
						}, function(err, result){
							if(err){
								res.send(err);
							}else{
								res.send(result);
							}
						})
					}
				});
			}else{
				res.send(res.error);
			}
		},
		get: function(req, res){
			console.log('trips.get!!!');
			var route = req.routeId;
			var trip = req.trip;
			if(route != null){
				gtfs.Trip.find({ route_id: route.route_id, trip_id: trip.trip_id }, function(err, data){
					if(data)
						res.send(data);
				});
			}else{
				res.send(res.error);
			}
		}
	},
	stops: {
		list: function(req, res){
			console.log('stops.list!!!');
			var trip = req.trip;
			if(trip != null){
				gtfs.StopTime.find({ trip_id: trip.trip_id }, null, { sort: 'stop_sequence' }, function(err, stoptimeData){
					if(stoptimeData != null){
						async.map(stoptimeData, function(stopObj, next){
							var stop = stopObj.toObject();
							gtfs.Stop.findOne({ stop_id: stopObj.stop_id }, function(err, stopData){
								if(stopData != null){
									// console.log('stopObj', stopObj.stop_id, 'stopData', stopData.stop_id, (stopObj.stop_id == stopData.stop_id));
									stop.details = stopData;
									// console.log(stop);
								}	
								next(err, stop);
							});
						},function(err, result){
							if(err){
								res.send(err);
							}else{
								res.send(result);	
							}
						});
					}
				});
			}else{
				res.send(res.error);
			}
		}
	},
	calendar: {
		list: function(req, res){
			console.log('calendar.list!!!');
			var trip = req.trip;
			if(trip != null){
				gtfs.Calendar.find({ service_id: trip.service_id }, function(err, data){
					if(data)
						res.send(data);
				});
			}else{
				res.send(res.error);	
			}
		}
	},
	_loadAId: function(req, res, next, aId){
		console.log('_loadAId!!!');
		gtfs.Agency.findOne({ agency_id: aId }, function(err, data){
			if(data != null){
				// console.log('data', data);
	      req.agency = data;
	      // next();
	    }else{
	    	res.error = 'No routes for agency_id ' + aId;
	    	// next('routes');
	    }
	    next();
		});
	},
	_loadRId: function(req, res, next, rId){
		console.log('_loadRId!!!');
		// use findOne because data is sure to have unique route_id, as per checking
		gtfs.Route.findOne({ route_id: rId }, function(err, data){
			if(data != null){
				// console.log('data', data);
				req.routeId = data;
			}else{
				res.error = 'No data for route_id ' + rId;
			}
			next();
		});
	},
	_loadTId: function(req, res, next, tId){
		gtfs.Trip.findOne({ trip_id: tId }, function(err, data){
			if(data != null){
				req.trip = data;
			}else{
				res.error = 'No data for trip_id ' + tId;
			}
			next();
		})
	}
}