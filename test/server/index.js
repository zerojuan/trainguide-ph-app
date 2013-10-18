var should = require('should'),
    request = require('supertest'),
    cheerio = require('cheerio');

describe('Index', function(){
    it('respond with development assets in development', function(done){
        var app = require('../../app.js')({
            'MONGOHQ_URL' : 'mongodb://mastertest:testacool@127.0.0.1:27017/gtfs',
            'NODE_ENV' : 'development'
        });

        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                var $ = cheerio.load(res.text);

                //must not find a shortened script file in development
                ($('script[src*="./scripts/scripts.js"]').length).should.equal(0);
                done();
            });

    });

    it('respond with production assets in production', function(done){
        var app = require('../../app.js')({
            'MONGOHQ_URL' : 'mongodb://mastertest:testacool@127.0.0.1:27017/gtfs',
            'NODE_ENV' : 'production'
        });

        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                var $ = cheerio.load(res.text);

                //must not see a minified script in production
                ($('script[src*="./scripts/scripts.js"]').length).should.equal(1);
                done();
            });

    });
});