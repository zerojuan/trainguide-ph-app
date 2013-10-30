
var gtfs = require('gtfs-2');
var LineDetails = require('../models/linedetails');
var async = require('async');

module.exports = {
	agencies: {
		list: function(req, res){
			gtfs.agencies(function(e, data){
	      res.send(data || {error: 'No agencies in database'});
	    });
		},
		get: function(req, res){
			var agency = req.agency;
			res.send(agency || res.error);
		}
	},
	routes: {
		list: function(req, res){
			var agency = req.agency;
			if(agency != null){
				gtfs.Route.find({ agency_id: agency.agency_id }, function(err, data){
					if(data)
		      	res.send(data);	
		    });	
			}else{
				res.send({error: 'Incorrect agency_id'});
			}
		},
		get: function(req, res){
			var route = req.routeId;
			res.send(route || res.error);
		}
	},
	details: {
		get: function(req, res){
			var route = req.routeId;
			LineDetails.findOne({ route_id: route.route_id }, function(err, detailsData){
				if(err){
					res.send(err);
				}else{
					res.send(detailsData);
				}
			});
		}
	},
	trips: {
		list: function(req, res){
			var route = req.routeId;
			if(route != null){
				gtfs.Trip.find({ route_id: route.route_id }, function(err, trips){
					if(trips){
						async.map(trips, function(trip, next){
							gtfs.Calendar.findOne({service_id: trip.service_id}, function(err, calendar){
								var locTrip = trip.toObject();
								if(calendar){
									locTrip.calendar = calendar;
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
			var trip = req.trip;
			if(trip != null){
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
	transfers: {
		list: function(req, res){
			gtfs.Transfer.find({}, function(err, transferData){
				if(transferData){
					res.send(transferData);
				}else{
					res.send(err);
				}
			});
		}
	},
	_loadAId: function(req, res, next, aId){
		gtfs.Agency.findOne({ agency_id: aId }, function(err, data){
			if(data != null){
	      req.agency = data;
	      // next();
	    }else{
	    	res.error = 'No routes for agency_id ' + aId;
	    }
	    next();
		});
	},
	_loadRId: function(req, res, next, rId){
		// use findOne because data is sure to have unique route_id, as per checking
		gtfs.Route.findOne({ route_id: rId }, function(err, data){
			if(data != null){
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