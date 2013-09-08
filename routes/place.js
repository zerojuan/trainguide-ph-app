var Place = require('../models/place')
  , gtfs = require('gtfs-2')
  , async = require('async')
  , constants = require('../constants')
  , mapRegEx = new RegExp('Reg = /^https?\:\/\/(www\.|maps\.)?google\.[a-z]+\/maps\/?\?([^&]+&)*(ll=-?[0-9]{1,2}\.[0-9]+,-?[0-9]{1,2}\.[0-9]+|q=[^&]+)+($|&)/');

module.exports = {
  index: function(req, res){
    console.log('index!!!');
    // Place.find({}, null, { skip: 0, limit: 5 }, function(err, docs) {
    //     if(Object.keys(docs).length > 0){
    //       // console.log('PLACES: ', docs);
    //     }else{
    //       docs.error = 'No data';
    //     }
    //     res.render('places/index', { places: docs } );
    // });
    var indexParams = { 
      places: [], 
      categories: constants.CATEGORY,
      subcategories: constants.SUBCATEGORY
    };
  
    res.render('places/index', indexParams);
    // var places = Place.find({}, function(err, docs){
    //   if(Object.keys(docs).length > 0){
    //     // console.log('PLACES: ', docs);
    //   }else{
    //     docs.error = 'No data';
    //   }
    //   res.render('places/index', { places: docs } );
    // });
  },
  show: function(req, res){
    // console.log('show!!!', req.place);
    console.log("REQ PLACE: ", req.place);
    var place = req.place;
    console.log('place!', place);
    res.render('places/show', { place: place });  
  },
  new: function(req, res){
    var trains = constants.AGENCIES;
    var lines = {};
    gtfs.Route.find({$or: trains}, null, {sort: 'route_id'}, function(err, data){
      if(data){
        // console.log('routes data', data);
        for (var i = 0; i < data.length; i++) {
          lines[data[i].route_id] = data[i].route_short_name;
        };

        console.log(lines);
        var newParams = { 
          lines: lines,
          categories: constants.CATEGORY,
          subcategories: constants.SUBCATEGORY
        }
        res.render('places/new', newParams );  
      }else{
        res.send('Error: ' + error);
      }
    });
  },
  stops: function(req, res){
    var selected = req.query.selectedStn;
    console.log('SELECTED: ', selected);
    gtfs.Route.findOne({route_id: selected}, function(err, route){
      // console.log('route!!!', route);
      if(route){
          gtfs.Trip.find({route_id: route.route_id}, function(err, trips){
            // console.log('trip!!!', trips[0]);
            if(trips){
              gtfs.StopTime.find({trip_id: trips[0].trip_id}, function(err, stops){
                // console.log('stop!!!', stops);
                async.map(stops, function(stopObj, next){
                  var stop = {};
                  stop.stop_id = stopObj.stop_id;
                  gtfs.Stop.findOne({stop_id: stopObj.stop_id}, function(err, stopData){
                    if(stopData){
                      stop.name = stopData.stop_name;
                    };
                    next(err, stop);
                  })
                }, function(err, result){
                  if(err){
                    res.send(err);
                  }else{
                    res.send(result);
                  }
                })
                   
              });
            }
          });
      }else{
        res.send('No data');
      }
    });
  },
  preview: function(req, res){
    var place = req.body.place;
    var previewParams = { 
      place: place,
      formMethod: req.body.formMethod,
      formAction: req.body.formAction
    }
    console.log('place!!!', place);

    gtfs.Route.findOne({route_id: place.line}, function(err, route){
      if(route){
        place.line = route; 
        gtfs.Stop.findOne({stop_id: place.stop}, function(err, stop){
          if(stop){
            place.stop = stop;
            // console.log('preview req.body', place);
            // console.log('previewParams', previewParams);
            
            res.render('places/preview', previewParams); 
          }else{
            res.send('Error: ' + err);
          }
        });
      }
    });
  },
  create: function(req, res, next){
    // console.log('create req.body', req.body);
    var b = req.body;
    var place = new Place();

    place.name = b.name;
    place.line = {
      line_id: b.lineId,
      name: b.lineName,
      route_id: b.routeId
    };
    place.stop = {
      stop_id: b.stopId,
      name: b.stopName
    };
    place.distance = b.distance;
    place.website = b.website;
    place.map = b.map;
    var loc = b.coordinates.split(',');
    place.coordinates = { lng: loc[1], lat: loc[0] };
    place.category = b.category;
    place.subcategory = b.subcategory;

    console.log(place);
    place.save(function(err, place){
      if(err){
        console.log(err);
        next(err);
      }
        
      res.redirect('/places/' + place._id);
    });
  },
  edit: function(req, res){
    var trains = constants.AGENCIES;
    var lines = {};
    gtfs.Route.find({$or: trains}, null, {sort: 'route_id'}, function(err, data){
      if(data != null){
        // console.log('routes data', data);
        for (var i = 0; i < data.length; i++) {
          lines[data[i].route_id] = data[i].route_short_name;
        };

        console.log(lines);
        var editParams = { 
          place: req.place,
          lines: lines, 
          categories: constants.CATEGORY,
          subcategories: constants.SUBCATEGORY
        }
        res.render('places/edit', editParams); 
      }else{
        res.send('Error: ' + error);
      }
    });
  },
  update: function(req, res){
    console.log('update!!!');
    // console.log('req.place._id', req.place._id);
    // console.log('req.body', req.body);
    var b = req.body;
    Place.findOne({ _id: req.place._id }, function(err, place){
      if(err){
        console.log('Place not found: ', req.place._id);
        res.redirect('/places');
        return;
      }

      place.name = b.name;
      place.line = {
        line_id: b.lineId,
        name: b.lineName,
        route_id: b.routeId
      };
      place.stop = {
        stop_id: b.stopId,
        name: b.stopName
      };
      place.distance = b.distance;
      place.website = b.website;
      place.map = b.map;
      var loc = b.coordinates.split(',');
      place.coordinates = { lng: loc[1], lat: loc[0] };
      place.category = b.category;
      place.subcategory = b.subcategory;

      place.save(function(err, affected){
        if(err)
          console.log(err);
        console.log('affected rows ', affected);
        res.redirect('/places/' + req.place._id);
      });
    });
  },
  delete: function(req, res){
    console.log('delete!!!');
    Place.findOne({ _id: req.place._id }, function(err, place){
      if(err){
        console.log('Place not found: ', req.place._id);
        res.redirect('/places');
        return;
      }

      place.remove(function(err, affected){
        if(err)
          console.log(err);
        console.log('affected rows ', affected);
        res.redirect('/places');
      })
    });
  },
  search: function(req, res){
    console.log('search!!!', req.query.queryStr);

    if(req.query.queryStr){
      var qry = new RegExp(req.query.queryStr, 'i');
      var arr = [
        {name: qry}, 
        {line: qry}, 
        {'stop.name': qry}, 
        {distance: qry},  
        {category: qry}, 
        {subcategory: qry} 
      ];

      var findPlace = function(query){
        Place.find(query, null, { sort: '_id' }, function(err, places){
          if(err)
            console.log(err);
          if(req.query.format){
            res.json({ places: places });
          }else{
            res.render('places/search', { places: places }); 
          }
        });
      };

      if(req.query.category){
        findPlace({ $and: [ {$or: arr}, {category: req.query.category} ] });
      }else{
        findPlace({ $or: arr });
      }

      console.log('arr:', arr, 'category', req.query.category);
    }
  },
  paginate: function(req, res){
    console.log('paginate!!!');
    var start = req.query.start;
    var limit = req.query.limit;
    var category = req.query.category;
    var stop = req.query.stopname;
    var arr = [ 
      {category: category}
    ];
    if(stop)
      arr.push({'stop.name': stop });

    console.log(start, limit, '!!!!');
    console.log('arr:', arr);
    // Place.find({ category: category }, null, { sort: '_id', skip: start, limit: limit }, function(err, docs) {
    // Place.find({ category: category }, null, { sort: 'name', skip: start, limit: limit }, function(err, docs) {
    Place.find({ $and: arr }, null, { sort: 'name', skip: start, limit: limit }, function(err, docs) {
      if(Object.keys(docs).length > 0){
        console.log('PLACES: ', docs);
      }else{
        docs.error = 'No data';
        console.log('PLACES: ', err);
      }
      res.send(docs);
    });
  },
  _loadPlace: function(req, res, next, pId){
    console.log('_loadPlace!!!', pId);
    Place.findOne({ _id: pId }, function(err, docs){
      // console.log('err', err, 'docs', docs);
      if(docs != null){
        req.place = docs;
      }
      next();
    });
  }
}