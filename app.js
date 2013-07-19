
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

mongoose.createConnection(process.env.MONGOHQ_URL);

var api = require('./routes/api');
var places = require('./routes/place');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//identify api routes
app.get('/api/agencies', api.agencies.list);
app.param('agency_id', api._loadAId);
app.get('/api/agencies/:agency_id', api.agencies.get);
app.get('/api/agencies/:agency_id/routes', api.routes.list);
app.param('route_id', api._loadRId);
app.get('/api/agencies/:agency_id/routes/:route_id', api.routes.get);
app.get('/api/routes/:route_id/trips', api.trips.list);
app.param('trip_id', api._loadTId);
app.get('/api/routes/:route_id/trips/:trip_id', api.trips.get);
app.get('/api/trips/:trip_id/stops', api.stops.list);
app.get('/api/trips/:trip_id/calendar', api.calendar.list);

//places
app.get('/places', places.index);
app.get('/places/search-place', places.search);
app.get('/places/new', places.new);
app.get('/places/station-stops', places.stops);
app.post('/places/preview', places.preview);
app.post('/places', places.create);
app.param('placeId', places._loadPlace);
app.get('/places/:placeId', places.show);
app.get('/places/:placeId/edit', places.edit);
app.put('/places/:placeId/edit', places.update);
app.del('/places/:placeId/delete', places.delete);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});