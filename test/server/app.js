
var should = require('should');


describe('App Bootstrap', function(){
    it('calling app.js should produce a function', function(){
        var app = require('../../app.js')({
            'MONGOHQ_URL' : 'mongodb://mastertest:testacool@127.0.0.1:27017/gtfs',
            'NODE_ENV' : 'development'
        });

        app.should.be.an.instanceOf(Function);
    });
});