var should = require('should'),
    request = require('supertest');

var app = require('../../app.js')({
    'MONGOHQ_URL' : 'mongodb://mastertest:testacool@127.0.0.1:27017/gtfs',
    'NODE_ENV' : 'development'
});

describe('GTFS API', function(){
    describe('Agencies', function(){
        it('should get all agencies', function(done){
            request(app)
                .get('/api/agencies')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var agencies = res.body;
                    (agencies.length).should.equal(5);
                    done();
                });
        });
        it('should get an agency with specific id', function(done){
            request(app)
                .get('/api/agencies/PNR')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var agency = res.body;
                    (agency.agency_name).should.equal('Philippine National Railways');
                    done();
                });
        });
    });
    describe('Routes', function(){        
        it('should return an array of routes for the specific agency id', function(done){
            request(app)
                .get('/api/agencies/PNR/routes')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var routes = res.body;
                    (routes).should.be.an.instanceOf(Array);

                    var route1 = routes[0];
                    (route1).should.have.property('agency_id');
                    (route1).should.have.property('route_short_name');
                    (route1).should.have.property('route_long_name');
                    (route1).should.have.property('route_desc');
                    (route1).should.have.property('route_type');
                    (route1).should.have.property('route_url');
                    (route1).should.have.property('route_color');
                    (route1).should.have.property('route_text_color');
                    (route1).should.have.property('route_bikes_allowed');
                    (route1).should.have.property('route_id');
                    (route1).should.have.property('agency_key');
                    (route1).should.have.property('_id');

                    done();
                });
        });
        it('should return an object with correct route data', function(done){
            request(app)
                .get('/api/agencies/PNR/routes/ROUTE_880872')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var route1 = res.body;
                    (route1.agency_id).should.equal('PNR');
                    (route1.route_short_name).should.equal('PNR MC');
                    (route1.route_long_name).should.equal('Metro Commuter');
                    (route1.route_desc).should.equal('PNR Metro South Commuter connects the cities of Manila, Pasay and Muntinlupa');
                    (route1.route_type).should.equal('2');
                    (route1.route_url).should.equal('http://www.pnr.gov.ph/metro_commuter.htm');
                    (route1.route_color).should.equal('e58e11');
                    (route1.route_text_color).should.equal('');
                    (route1.route_bikes_allowed).should.equal('0');
                    (route1.route_id).should.equal('ROUTE_880872');
                    (route1.agency_key).should.equal('philippines');
                    (route1._id).should.equal('51ea970c70c336c76e000e10');

                    done();
                });
        });
    });
    describe('Trips', function(){
        it('should return an array of trips for specific route', function(done){
            request(app)
                .get('/api/routes/ROUTE_880872/trips')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var trips = res.body;
                    (trips).should.be.an.instanceOf(Array);

                    var trip1 = trips[0];
                    (trip1).should.have.property('route_id');
                    (trip1).should.have.property('service_id');
                    (trip1).should.have.property('trip_short_name');
                    (trip1).should.have.property('trip_headsign');
                    (trip1).should.have.property('route_short_name');
                    (trip1).should.have.property('direction_id');
                    (trip1).should.have.property('block_id');
                    (trip1).should.have.property('shape_id');
                    (trip1).should.have.property('wheelchair_accessible');
                    (trip1).should.have.property('trip_bikes_allowed');
                    (trip1).should.have.property('trip_id');
                    (trip1).should.have.property('agency_key');
                    (trip1).should.have.property('_id');
                    (trip1).should.have.property('calendar');
                    (trip1.calendar).should.have.property('service_id');
                    (trip1.calendar).should.have.property('monday');
                    (trip1.calendar).should.have.property('tuesday');
                    (trip1.calendar).should.have.property('wednesday');
                    (trip1.calendar).should.have.property('thursday');
                    (trip1.calendar).should.have.property('friday');
                    (trip1.calendar).should.have.property('saturday');
                    (trip1.calendar).should.have.property('sunday');
                    (trip1.calendar).should.have.property('_id');

                    done();
                });
        });
        it('should return an object with correct trip data', function(done){
            request(app)
                .get('/api/routes/ROUTE_880872/trips/882001')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var trip1 = res.body[0];
                    (trip1.route_id).should.equal('ROUTE_880872');
                    (trip1.service_id).should.equal('882002');
                    (trip1.trip_short_name).should.equal('');
                    (trip1.trip_headsign).should.equal('');
                    (trip1.route_short_name).should.equal('');
                    should(trip1.direction_id).equal(null);
                    (trip1.block_id).should.equal('');
                    (trip1.shape_id).should.equal('881953');
                    (trip1.wheelchair_accessible).should.equal('0');
                    (trip1.trip_bikes_allowed).should.equal('0');
                    (trip1.trip_id).should.equal('882001');
                    (trip1.agency_key).should.equal('philippines');
                    (trip1._id).should.equal('51ea971d70c336c76e015e60');

                    done();
                });
        });
    });
    describe('Details', function(){        
        it('should get the details of a specific route', function(done){
            request(app)
                .get('/api/details/ROUTE_880872')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var details = res.body;
                    (details.web).should.equal('www.pnr.gov.ph');
                    (details.twitter).should.equal('@PNRRailways');
                    (details.fare).should.equal('P10-P15');
                    (details.email).should.equal('');
                    (details.contact).should.equal('319-0045');
                    (details.weekend).should.equal('5:05am to 6:30pm');
                    (details.weekdays).should.equal('5:05am to 6:30pm');
                    (details.route_id).should.equal('ROUTE_880872');
                    (details._id).should.equal('521f075545ad6fd40d000010');

                    done();
                });
        });
    });
    describe('Stops', function(){
        it('should return an array of stops for a specific trip', function(done){
            request(app)
                .get('/api/trips/882001/stops')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var stops = res.body;
                    (stops).should.be.an.instanceOf(Array);

                    var stop1 = stops[0];
                    (stop1).should.have.property('trip_id');
                    (stop1).should.have.property('stop_sequence');
                    (stop1).should.have.property('stop_id');
                    (stop1).should.have.property('arrival_time');
                    (stop1).should.have.property('departure_time');
                    (stop1).should.have.property('stop_headsign');
                    (stop1).should.have.property('route_short_name');
                    (stop1).should.have.property('pickup_type');
                    (stop1).should.have.property('drop_off_type');
                    (stop1).should.have.property('shape_dist_traveled');
                    (stop1).should.have.property('agency_key');
                    (stop1).should.have.property('_id');
                    (stop1).should.have.property('details');
                    (stop1.details).should.have.property('stop_id');
                    (stop1.details).should.have.property('stop_code');
                    (stop1.details).should.have.property('stop_name');
                    (stop1.details).should.have.property('stop_desc');
                    (stop1.details).should.have.property('stop_lat');
                    (stop1.details).should.have.property('stop_lon');
                    (stop1.details).should.have.property('zone_id');
                    (stop1.details).should.have.property('stop_url');
                    (stop1.details).should.have.property('location_type');
                    (stop1.details).should.have.property('parent_station');
                    (stop1.details).should.have.property('wheelchair_boarding');
                    (stop1.details).should.have.property('stop_direction');
                    (stop1.details).should.have.property('agency_key');
                    (stop1.details).should.have.property('_id');
                    (stop1.details).should.have.property('loc');
                    (stop1.details.loc).should.be.an.instanceOf(Array);

                    done();
                });
        })
        it('should return an object with correct stop data', function(done){
            request(app)
                .get('/api/trips/882001/stops')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var stop1 = res.body[0];
                    (stop1.trip_id).should.equal('882001');
                    (stop1.stop_sequence).should.equal(1);
                    (stop1.stop_id).should.equal('LTFRB_4988');
                    (stop1.arrival_time).should.equal('00:00:00');
                    (stop1.departure_time).should.equal('00:00:00');
                    (stop1.stop_headsign).should.equal('');
                    (stop1.route_short_name).should.equal('');
                    (stop1.pickup_type).should.equal('0');
                    (stop1.drop_off_type).should.equal('0');
                    (stop1.shape_dist_traveled).should.equal('');
                    (stop1.agency_key).should.equal('philippines');
                    (stop1._id).should.equal('51ea971b70c336c76e014359');
                    (stop1.details.stop_id).should.equal('LTFRB_4988');
                    (stop1.details.stop_code).should.equal('');
                    (stop1.details.stop_name).should.equal('Tutuban PNR');
                    (stop1.details.stop_desc).should.equal('');
                    (stop1.details.stop_lat).should.equal(14.611304766357218);
                    (stop1.details.stop_lon).should.equal(120.97311973571776);
                    (stop1.details.zone_id).should.equal('');
                    (stop1.details.stop_url).should.equal('');
                    (stop1.details.location_type).should.equal('0');
                    (stop1.details.parent_station).should.equal('');
                    (stop1.details.wheelchair_boarding).should.equal('0');
                    (stop1.details.stop_direction).should.equal('');
                    (stop1.details.agency_key).should.equal('philippines');
                    (stop1.details._id).should.equal('51ea971c70c336c76e01570e');
                    (stop1.details.loc).should.include(120.97311973571776);
                    (stop1.details.loc).should.include(14.611304766357218);

                    done();
                });
        });
    });
    describe('Calendars', function(){
        it('should return an array of calendar for the specific trip', function(done){
            request(app)
                .get('/api/trips/882001/calendar')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var calendars = res.body;
                    (calendars).should.be.an.instanceOf(Array);

                    var calendar1 = calendars[0];
                    (calendar1).should.have.property('service_id');
                    (calendar1).should.have.property('monday');
                    (calendar1).should.have.property('tuesday');
                    (calendar1).should.have.property('wednesday');
                    (calendar1).should.have.property('thursday');
                    (calendar1).should.have.property('friday');
                    (calendar1).should.have.property('saturday');
                    (calendar1).should.have.property('sunday');
                    (calendar1).should.have.property('start_date');
                    (calendar1).should.have.property('end_date');
                    (calendar1).should.have.property('agency_key');
                    (calendar1).should.have.property('_id');

                    done();
                });
        });
        it('should return an object with correct calendar data', function(done){
            request(app)
                .get('/api/trips/882001/calendar')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var calendar1 = res.body[0];                    
                    (calendar1.service_id).should.equal('882002');
                    (calendar1.monday).should.equal('1');
                    (calendar1.tuesday).should.equal('1');
                    (calendar1.wednesday).should.equal('1');
                    (calendar1.thursday).should.equal('1');
                    (calendar1.friday).should.equal('1');
                    (calendar1.saturday).should.equal('1');
                    (calendar1.sunday).should.equal('0');
                    (calendar1.start_date).should.equal('20130617');
                    (calendar1.end_date).should.equal('20140630');
                    (calendar1.agency_key).should.equal('philippines');
                    (calendar1._id).should.equal('51ea970b70c336c76e00000a');

                    done();
                });
        });
    });
    describe('Transfers', function(){     
        it('should return an array of transfers for all trains', function(done){
            request(app)
                .get('/api/transfers')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var transfers = res.body;
                    (transfers).should.be.an.instanceOf(Array);

                    var transfer1 = transfers[0];
                    (transfer1).should.have.property('min_transfer_time');
                    (transfer1).should.have.property('transfer_type');
                    (transfer1).should.have.property('to_stop_id');
                    (transfer1).should.have.property('from_stop_id');
                    (transfer1).should.have.property('agency_key');
                    (transfer1).should.have.property('_id');

                    done();
                });
        });   
        it('should return an object with correct transfer data', function(done){
            request(app)
                .get('/api/transfers')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);

                    var transfer1 = res.body[0];
                    (transfer1.min_transfer_time).should.equal('15min');
                    (transfer1.transfer_type).should.equal('1');
                    (transfer1.to_stop_id).should.equal('LTFRB_4975');
                    (transfer1.from_stop_id).should.equal('LTFRB_5001');
                    (transfer1.agency_key).should.equal('PNR');
                    (transfer1._id).should.equal('521f075545ad6fd40d000001');

                    done();
                });
        });
    });
});