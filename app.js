/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');


exports = module.exports = createApplication;


function createApplication(env) {
    //    var options = {
    //        server: {},
    //        replset: {}
    //    };
    //    options.server.socketOptions = options.replset.socketOptions = {keepAlive: 1};

    mongoose.connection.on('open', function() {
        console.log('Connected to database');
    });

    mongoose.connection.on('error', function(err) {
        //        console.log('Connection could not connect');
        //        console.log(err);
    });
    connectToDatabase(env);

    var api = require('./routes/api');
    var places = require('./routes/place');
    var viewer = require('./routes/viewer');
    var generator = require('./routes/generator');

    var app = express();




    app.locals({
        isProduction: function() {
            return 'production' == env.NODE_ENV;
        }
    });
    // all environments
    app.set('port', env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('supersecretive'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')(
        __dirname + '/public'
    ));

    // development only
    if ('production' == env.NODE_ENV) {
        app.use(express.static(path.join(__dirname, 'dist')));
    } else {
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.errorHandler());
    }

    app.get('/viewer', viewer.index);

    app.get('/', function(req, res) {
        routes.index(req, res);
    });
    app.get('/views', routes.partials);
    app.get('/users', user.list);

    app.get('/generatestatic', generator.generateStaticData);
    app.get('/insertadditional', generator.insertAdditionalData);

    //identify api routes
    app.get('/api/agencies', api.agencies.list);
    app.param('agency_id', api._loadAId);
    app.get('/api/agencies/:agency_id', api.agencies.get);
    app.get('/api/agencies/:agency_id/routes', api.routes.list);
    app.param('route_id', api._loadRId);
    app.get('/api/agencies/:agency_id/routes/:route_id', api.routes.get);
    app.get('/api/routes/:route_id/trips', api.trips.list);
    app.get('/api/details/:route_id', api.details.get);
    app.param('trip_id', api._loadTId);
    app.get('/api/routes/:route_id/trips/:trip_id', api.trips.get);
    app.get('/api/trips/:trip_id/stops', api.stops.list);
    app.get('/api/trips/:trip_id/calendar', api.calendar.list);
    app.get('/api/transfers', api.transfers.list);

    //places
    app.get('/places', places.index);
    app.get('/places/search-place', places.search);
    app.get('/places/paginate-place', places.paginate);
    app.get('/places/new', places.new);
    app.get('/places/station-stops', places.stops);
    app.post('/places/preview', places.preview);
    app.post('/places', places.create);
    app.param('placeId', places._loadPlace);
    app.get('/places/:placeId', places.show);
    app.get('/places/:placeId/edit', places.edit);
    app.put('/places/:placeId/edit', places.update);
    app.del('/places/:placeId/delete', places.delete);

    return app;
}

function connectToDatabase(env) {
    console.log('Connecting to DB: ' + env.MONGOHQ_URL);
    mongoose.connect(env.MONGOHQ_URL);
}