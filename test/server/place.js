var should = require('should'),
    request = require('supertest')
    cheerio = require('cheerio'),
    Place = require('../../models/place');

var app = require('../../app.js')({
  'MONGOHQ_URL' : 'mongodb:/mastertest:testacool@127.0.0.1:27017/gtfs',
  'NODE_ENV' : 'development'
});

describe('PLACE Resource', function(){
  describe('View methods', function(){
    describe('Index page', function(){
      it('should display a table', function(done){
        request(app)
          .get('/places')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            var $ = cheerio.load(res.text);
            ($('#place-tbl').length).should.equal(1);
            done();
          });
      });
      it('should display a dropdown list',function(done){
        request(app)
          .get('/places')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            var $ = cheerio.load(res.text);
            ($('#category').length).should.equal(1);

            ($('#category option[value="Dining"]').length).should.equal(1);
            ($('#category option[value="Entertainment"]').length).should.equal(1);
            ($('#category option[value="Government Building"]').length).should.equal(1);
            ($('#category option[value="Hospital"]').length).should.equal(1);
            ($('#category option[value="Hotel"]').length).should.equal(1);
            ($('#category option[value="Office"]').length).should.equal(1);
            ($('#category option[value="Religion"]').length).should.equal(1);
            ($('#category option[value="Residential"]').length).should.equal(1);
            ($('#category option[value="School"]').length).should.equal(1);
            ($('#category option[value="Service"]').length).should.equal(1);
            ($('#category option[value="Shopping"]').length).should.equal(1);
            ($('#category option[value="Sightseeing"]').length).should.equal(1);
            ($('#category option[value="Sports"]').length).should.equal(1);
            ($('#category option[value="Transport Terminal"]').length).should.equal(1);
            done();
          });
      });
    });
    describe('Search function', function(){
      it('should display values for correct input', function(done){
        request(app)
          .get('/places/search-place?queryStr=mabuhay')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            var $ = cheerio.load(res.text);
            ($('table').length).should.equal(1);
            done();
          });
      });
      it('should display "No data found." for incorrect input', function(done){
        request(app)
          .get('/places/search-place?queryStr=wronginput')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            var response = res.text;
            (response).should.equal('No data found.');
            done();
          });
      });
    });
    describe('Paginate function', function(){
      it('should return an array of the next set of data', function(done){
        request(app)
          .get('/places/paginate-place?limit=5&start=5&category=Hotel')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
            if(err) return done(res);

            var nextData = res.body;
            (nextData).should.be.an.instanceOf(Array);

            var nextData1 = nextData[0];
            (nextData1).should.have.property('_id');
            (nextData1).should.have.property('category');
            (nextData1).should.have.property('distance');
            (nextData1).should.have.property('map');
            (nextData1).should.have.property('name');
            (nextData1).should.have.property('subcategory');
            (nextData1).should.have.property('website');
            (nextData1).should.have.property('coordinates');
            (nextData1.coordinates).should.have.property('lng');
            (nextData1.coordinates).should.have.property('lat');
            (nextData1).should.have.property('stop');
            (nextData1.stop).should.have.property('stop_id');
            (nextData1.stop).should.have.property('name');
            (nextData1).should.have.property('line');
            (nextData1.line).should.have.property('line_id');
            (nextData1.line).should.have.property('name');
            (nextData1.line).should.have.property('route_id');

            done();
          })
      });
      it('should return the correct place object', function(done){
        request(app)
          .get('/places/paginate-place?limit=5&start=5&category=Hotel')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
            if(err) return done(res);

            var nextData1 = res.body[0];
            (nextData1._id).should.equal('51ecc0cca0fdbcb911000009');
            (nextData1.category).should.equal('Hotel');
            (nextData1.distance).should.equal('800m');
            (nextData1.map).should.equal('https://maps.google.com/maps?saddr=LRT-1+Vito+Cruz+Station,+Manila,+Metro+Manila,+Philippines&daddr=Alejandra+Hotel,+Zobel+Roxas+Avenue,+Makati+City,+Metro+Manila,+Philippines&hl=en&ll=14.56372,120.997635&spn=0.004912,0.007639&sll=14.562046,120.993046&sspn=0.004912,0.007639&geocode=FV443gAdxTs2BylL8Kg_ecmXMzFLkpkRB73pbA%3BFe833gAdgVI2ByFsOAbADqJz6ikRPL5yd8mXMzFsOAbADqJz6g&oq=ale&dirflg=w&mra=ls&t=m&z=17');
            (nextData1.name).should.equal('Alejandra Hotel');
            (nextData1.subcategory).should.equal('');
            (nextData1.website).should.equal('http://www.alejandrahotel.com/home');
            (nextData1.coordinates.lng).should.equal(121.000644);
            (nextData1.coordinates.lat).should.equal(14.563312);
            (nextData1.stop.stop_id).should.equal('51ea971b70c336c76e014439');
            (nextData1.stop.name).should.equal('Vito Cruz LRT');
            (nextData1.line.line_id).should.equal('51ea970c70c336c76e00075e');
            (nextData1.line.name).should.equal('LRT 1');
            (nextData1.line.route_id).should.equal('ROUTE_880747');

            done();
          });
      });
    });
    describe('New page', function(){
      it('should display new form', function(done){
        request(app)
          .get('/places/new')
          .expect(200)
          .end(function(err, res){
            if(err) return done(res);

            var $ = cheerio.load(res.text);
            ($('body h2.subheader').first().text()).should.equal('New Place');
            ($('form#input-place').length).should.equal(1);
            ($('form #preview').length).should.equal(1);
            done();
          });
      });
      describe('Populate Stops', function(){
        it('should return an array of station stops for a specific line', function(done){
          request(app)
            .get('/places/station-stops?selectedStn=ROUTE_880801')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
              if(err) return done(res);

              var stops = res.body;
              (stops).should.be.an.instanceOf(Array);

              var stops1 = stops[0];
              (stops1).should.have.property('stop_id');
              (stops1).should.have.property('name');
              done();
            });
        });
        it('should return an object for station stop', function(done){
          request(app)
            .get('/places/station-stops?selectedStn=ROUTE_880801')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
              if(err) return done(err);

              var stops1 = res.body[0];
              (stops1.stop_id).should.equal('LTFRB_4977');
              (stops1.name).should.equal('Recto LRT');
              done();
            });
        });
      });
      describe('Preview new place', function(){
        var previewParams;

        before(function(done){
          previewParams = { 
            place: { name: 'new data',
                     line: 'ROUTE_880801',
                     stop: 'LTFRB_4977',
                     distance: '200m',
                     website: 'http://goog.com',
                     map: 'http://goog.com',
                     coordinates: '12323,243242',
                     category: 'Dining',
                     subcategory: 'Bar' },
          formMethod: 'POST',
          formAction: '/places' }

          done();
        });
        it('should display the input form values into a table', function(done){
          request(app)
            .post('/places/preview')
            .send(previewParams)
            .expect(200)
            .end(function(err, res){
              if(err) return done(res);

              var $ = cheerio.load(res.text);
              ($('h2.subheader').text()).should.equal('Preview New Place');
              ($('form input[name="name"]').val()).should.equal('new data');
              ($('form input[name="lineId"]').val()).should.equal('51ea970c70c336c76e00075f');
              ($('form input[name="stopId"]').val()).should.equal('51ea971b70c336c76e014449');
              ($('form input[name="lineName"]').val()).should.equal('LRT 2');
              ($('form input[name="routeId"]').val()).should.equal('ROUTE_880801');
              ($('form input[name="stopName"]').val()).should.equal('Recto LRT');
              ($('form input[name="distance"]').val()).should.equal('200m');
              ($('form input[name="website"]').val()).should.equal('http://goog.com');
              ($('form input[name="map"]').val()).should.equal('http://goog.com');
              ($('form input[name="coordinates"]').val()).should.equal('12323,243242');
              ($('form input[name="category"]').val()).should.equal('Dining');
              ($('form input[name="subcategory"]').val()).should.equal('Bar');
              done();
            });
        });
      });
    });
    describe('Show page', function(){
      it('should retrieve place data and display the page', function(done){
        request(app)
          .get('/places/51ecaf49a0fdbcb911000001')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            var $ = cheerio.load(res.text);
            ($('table').length).should.equal(1);
            ($('.row a').first().attr('href')).should.equal('/places/51ecaf49a0fdbcb911000001/edit');
            done();
          });
      });
    });
    describe('Edit page', function(){
      var previewParams;

      beforeEach(function(done){
        previewParams = { 
          place: { name: 'The Mabuhay Manor',
                   line: 'ROUTE_880747',
                   stop: 'LTFRB_4944',
                   distance: '650m',
                   website: 'http://www.mabuhaymanor.com.ph/',
                   map: 'https://maps.google.com/maps?saddr=LRT+1+Baclaran+Station+%4014.534286,120.998335&daddr=The+Mabuhay+Manor,+Pasay+City,+Metro+Manila,+Philippines&hl=en&ll=14.533749,120.997066&spn=0.004912,0.007639&sll=14.535712,120.99726&sspn=0.004912,0.007639&geocode=FY7G3QAdv0k2Bw%3BFd3K3QAd7T82ByGLvGQAt0gPcCmBy2S_UMmXMzGLvGQAt0gPcA&oq=mabuhay+&mra=prev&t=m&z=17',
                   coordinates: '120.995771,14.535359',
                   category: 'Hotel',
                   subcategory: '' },
          formMethod: 'PUT',
          formAction: '/places/51ecaf49a0fdbcb911000001/edit' }

        done();
      });
      it('should display edit form', function(done){
        request(app)
          .get('/places/51ecaf49a0fdbcb911000001/edit')
          .send(previewParams)
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            var $ = cheerio.load(res.text);
            ($('body h2.subheader').first().text()).should.equal('Edit Place');
            ($('form#input-place').length).should.equal(1);
            ($('form #preview').length).should.equal(1);
            done();
          });
      });
      it('should display a preview table', function(done){
        request(app)
          .post('/places/preview')
          .send(previewParams)
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            var $ = cheerio.load(res.text);
            ($('h2.subheader').text()).should.equal('Preview Edit Place');
            ($('form input[name="name"]').val()).should.equal('The Mabuhay Manor');
            ($('form input[name="lineId"]').val()).should.equal('51ea970c70c336c76e00075e');
            ($('form input[name="stopId"]').val()).should.equal('51ea971b70c336c76e014435');
            ($('form input[name="lineName"]').val()).should.equal('LRT 1');
            ($('form input[name="routeId"]').val()).should.equal('ROUTE_880747');
            ($('form input[name="stopName"]').val()).should.equal('Baclaran LRT');
            ($('form input[name="distance"]').val()).should.equal('650m');
            ($('form input[name="website"]').val()).should.equal('http://www.mabuhaymanor.com.ph/');
            ($('form input[name="map"]').val()).should.equal('https://maps.google.com/maps?saddr=LRT+1+Baclaran+Station+%4014.534286,120.998335&daddr=The+Mabuhay+Manor,+Pasay+City,+Metro+Manila,+Philippines&hl=en&ll=14.533749,120.997066&spn=0.004912,0.007639&sll=14.535712,120.99726&sspn=0.004912,0.007639&geocode=FY7G3QAdv0k2Bw%3BFd3K3QAd7T82ByGLvGQAt0gPcCmBy2S_UMmXMzGLvGQAt0gPcA&oq=mabuhay+&mra=prev&t=m&z=17');
            ($('form input[name="coordinates"]').val()).should.equal('120.995771,14.535359');
            ($('form input[name="category"]').val()).should.equal('Hotel');
            ($('form input[name="subcategory"]').val()).should.equal('');
            done();
          });
      });
    });
  });
  describe('Write methods', function(){
    describe('Create function', function(){
      var createParams,
          id;

      before(function(done){
        createParams = {
          name: 'new data',
          lineId: '51ea970c70c336c76e00075f',
          stopId: '51ea971b70c336c76e014449',
          lineName: 'LRT 2',
          routeId: 'ROUTE_880801',
          stopName: 'Recto LRT',
          distance: '200m',
          website: 'http://goog.com',
          map: 'http://goog.com',
          coordinates: '12323,243242',
          category: 'Dining',
          subcategory: 'Bar'};

        done();
      });
      it('should save the new place and redirect page', function(done){
        request(app)
          .post('/places')
          .send(createParams)
          .expect(302)
          .end(function(err, res){
            if(err) return done(err);

            var response = res.text;
            id = res.headers.location.split('/places/')[1];
            (response).should.include('/places/' + id);
            done();
          });
      });
      after(function(done){
        Place.remove({_id: id}, function(){
          done();
        });
      });
    });
    describe('Update function', function(){
      var updateParams,
          id = '5270b18aaa85e60a2c000001';

      before(function(done){
        Place.findOne({_id: id}, function(err, data){
          updateParams = {
            name: data.name,
            lineId: data.line.line_id,
            stopId: data.stop.stop_id,
            lineName: data.line.name,
            routeId: data.line.route_id,
            stopName: data.stop.name,
            distance: data.distance,
            website: 'http://newdata.com',
            map: data.map,
            coordinates: data.coordinates.lat + ',' + data.coordinates.lng,
            category: data.category,
            subcategory: data.subcategory};
          console.log('updateParams', updateParams);
          done();
        })
      });
      it('should save the updated place and redirect page', function(done){
        request(app)
          .put('/places/'+ id +'/edit')
          .send(updateParams)
          .expect(302)
          .end(function(err, res){
            if(err) return done(err);

            var response = res.text;
            id = res.headers.location.split('/places/')[1];
            (response).should.include('/places/' + id);
            done();
          });
      });
      after(function(done){
        Place.findOne({_id: id}, function(err, data){
          data.website = 'http://goog.com';
          data.save();
          done();
        });
      });
    });
    describe('Delete function', function(){
      var newPlace = new Place(),
          id;

      before(function(done){
        newPlace.name = 'Chowmaster';
        newPlace.line = {
          line_id: '51ea970c70c336c76e00075f',
          name: 'LRT 2',
          route_id: 'ROUTE_880801'
        };
        newPlace.stop = {
          stop_id: '51ea971b70c336c76e014449',
          name: 'Recto LRT'
        };
        newPlace.distance = '200m';
        newPlace.website = 'http://goog.com';
        newPlace.map = 'http://goog.com';
        newPlace.coordinates = { 
          lng: '12.323', 
          lat: '24.3242' 
        };
        newPlace.category = 'Dining';
        newPlace.subcategory = '';

        newPlace.save(function(err, data){
          id = data._id;
          done();
        });
      });
      it('should delete the place and redirect to /places', function(done){
        request(app)
          .del('/places/'+ id +'/delete')
          .expect(302)
          .end(function(err, res){
            if(err) return done(err);

            var response = res.text;
            (response).should.include('Redirecting to /places');
            done();
          });
      });
    });
  });
});