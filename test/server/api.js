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
});