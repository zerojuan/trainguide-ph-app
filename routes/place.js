var Place = require('../models/place');
var constants = require('../constants');
var mapRegEx = new RegExp('Reg = /^https?\:\/\/(www\.|maps\.)?google\.[a-z]+\/maps\/?\?([^&]+&)*(ll=-?[0-9]{1,2}\.[0-9]+,-?[0-9]{1,2}\.[0-9]+|q=[^&]+)+($|&)/');

module.exports = {
  index: function(req, res){
    console.log('index!!!');
    var places = Place.find({}, function(err, docs){
      if(Object.keys(docs).length > 0){
        // console.log('PLACES: ', docs);
      }else{
        docs.error = 'No data';
      }
      res.render('places/index', { places: docs } );
    });
  },
  show: function(req, res){
    console.log('show!!!', req.place);
    res.render('places/show', { place: req.place });
  },
  new: function(req, res){
    var newParams = { 
      stations: constants.STATION,
      categories: constants.CATEGORY 
    }
    res.render('places/new', newParams );
  },
  stops: function(req, res){
    var selected = req.query.selectedStn;
    var station;
    // console.log('SELECTED: ', selected);
    for (var i = 0; i < constants.STATION.length; i++) {
      var stnKey = constants.STATION[i];
      // console.log(stnKey);
      for(item in stnKey){
        if(selected === item){
          station = stnKey[item];
          // console.log(station); 
        }
      }
    };
    res.render('places/stops', { station: station });
  },
  preview: function(req, res){
    var previewParams = { 
      place: req.body.place,
      formMethod: req.body.formMethod,
      formAction: req.body.formAction
    }
    // console.log('preview req.body', place);
    // console.log('previewParams', previewParams);
    
    res.render('places/preview', previewParams);
  },
  create: function(req, res){
    // console.log('create req.body', req.body);
    var b = req.body;
    var place = new Place();

    place.name = b.name;
    place.station = b.station + ':' + b.stop;
    place.distance = b.distance;
    place.map = b.map;
    var loc = b.coordinates.split(',');
    place.coordinates = { lng: loc[0], lat: loc[1] };
    place.category = b.category;

    place.save(function(err, place){
      if(err)
        console.log(err);
      res.redirect('/places/' + place._id);
    });
  },
  edit: function(req, res){
    var editParams = { 
      place: req.place,
      stations: constants.STATION, 
      categories: constants.CATEGORY 
    }
    res.render('places/edit', editParams);
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
      place.station = b.station + ':' + b.stop;
      place.distance = b.distance;
      place.map = b.map;
      var loc = b.coordinates.split(',');
      place.coordinates = { lng: loc[0], lat: loc[1] };
      place.category = b.category;

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
    console.log('search!!!');
    var qry = new RegExp(req.query.queryStr, 'i');
    var arr = [
      {name: qry}, 
      {station: qry}, 
      {distance: qry}, 
      {map: qry}, 
      {coordinates: qry}, 
      {category: qry}, 
    ];

    Place.find({$or: arr}, function(err, places){
      if(err)
        console.log(err);
      console.log('arr:', arr, 'places: ', places);
      res.render('places/search', { places: places });
    })
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