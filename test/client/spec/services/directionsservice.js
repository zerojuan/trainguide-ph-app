'use strict';

describe('Service: DirectionsService', function(){

  beforeEach(module('trainguideServices', 'trainguide.filters'));

  var DirectionsService,
      httpBackend;

  var api = 'http://maps.pleasantprogrammer.com/opentripplanner-api-webapp/ws';
  var stopsPoint = function(lat, lon){
    return api+'/transit/stopsNearPoint?lat='+ lat +'&lon='+ lon +'&callback=JSON_CALLBACK';
  };
  var stopsDirection = function(avoidBuses, from, to){
    var banned = (avoidBuses) ? 'LTFRB' : '';
    var d = new Date();
    var dateNow = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    
    return api+'/plan?bannedAgencies='+banned+'&unpreferredAgencies=LTFRB&preferredAgencies=LRTA%2CMRTC%2CPNR&date='+dateNow+'%26time%3D11%3A59am&fromPlace='+from.lat+'%2C'+from.lng+'&toPlace='+to.lat+'%2C'+to.lng+'&numItineraries=2&mode=TRANSIT%2CWALK&callback=JSON_CALLBACK';
  };

  var extractLocation = function(str){
    var loc = str.substring(1, str.length-1).split(',');

    return {
      lat: loc[0].trim(), 
      lng: loc[1].trim()
    };
  };

  describe('bindFareMatrix function', function(){
    beforeEach(inject(function($httpBackend, _DirectionsService_){
      httpBackend = $httpBackend;
      DirectionsService = _DirectionsService_;
    }));

    it('should populate farematrix', function(){
      var fareMatrix = DirectionsService.bindFareMatrix('TRAIN', [1,2,3]);

      expect(fareMatrix.train[0]).toBe(1);
    });
  });

  describe('getStopsNearPoint function', function(){
    beforeEach(inject(function($httpBackend, _DirectionsService_){
      httpBackend = $httpBackend;
      DirectionsService = _DirectionsService_;
      var stops = [
        {stopName: 'Pureza Extension / Ramon Magsaysay Blvd Intersection, Manila'},
        {stopName: 'Recto LRT'}
      ];

      httpBackend.whenJSONP(stopsPoint(11,11)).respond({stops: stops});
      httpBackend.whenJSONP(stopsPoint(22,22)).respond({error: 'No trips found.'});
      httpBackend.whenJSONP(stopsPoint(33,33)).respond(500, '');
    }));

    it('should return nearby stops', function(){
      runs(function(){
        DirectionsService.getStopsNearPoint({from: {lat: 11, lon: 11}}, function(data){
          console.log("Success");
          expect(data).toContain({stopName: 'Pureza Extension / Ramon Magsaysay Blvd Intersection, Manila'});
          expect(data).not.toContain({stopName: 'Recto LRT'});
        }, function(data){
          console.log("Fail");
        });  

        httpBackend.flush();
      });
      waits(300);
    });

    it('should return error message on no trips found', function(){
      runs(function(){
        DirectionsService.getStopsNearPoint({from: {lat: 22, lon: 22}}, function(data){
          console.log("Success");
        }, function(data){
          console.log("Fail");
          expect(data).toContain('No trips found.');
        });  

        httpBackend.flush();
      });
      waits(300);
    });

    it('should return an internal server error 500', function(){
      runs(function(){
        DirectionsService.getStopsNearPoint({from: {lat: 33, lon: 33}}, function(data){
          console.log("Success");
        }, function(data){
          console.log("Fail");
          expect(data).toBe(500);
        });
        httpBackend.flush();
      });
      waits(300);
    });
  });

  describe('getDirections function', function(){
    var query1, query2, query3;
    var res1;

    beforeEach(inject(function($httpBackend, _DirectionsService_){
      httpBackend = $httpBackend;      
      DirectionsService = _DirectionsService_;

      query1 = {
        avoidBuses: true,
        from: {
          geometry: {
            location: "(11, 22)"
          }
        },
        to: {
          geometry: {
            location: "(33, 44)"
          }
        }
      };
      query2 = {
        avoidBuses: true,
        from: {
          geometry: {
            location: "(33, 44)"
          }
        },
        to: {
          geometry: {
            location: "(11, 22)"
          }
        }
      };
      query3 = {
        avoidBuses: true,
        from: {
          geometry: {
            location: "(11, 44)"
          }
        },
        to: {
          geometry: {
            location: "(33, 22)"
          }
        }
      };

      res1 = {
        plan: {
          itineraries: [
            {
              legs: [
                {
                  distance: 249,
                  duration: 207000,
                  fare: 0,
                  from: {
                    name: 'Taft Avenue',
                    stopIndex: null
                  },
                  mode: 'WALK',
                  routeId: null,
                  to: {
                    name: 'UN Ave LRT',
                    stopIndex: null
                  }  
                }
              ]
            }
          ]
        }
      };

      httpBackend.whenJSONP(stopsDirection(query1.avoidBuses, extractLocation(query1.from.geometry.location), extractLocation(query1.to.geometry.location))).respond(500, '');
      httpBackend.whenJSONP(stopsDirection(query2.avoidBuses, extractLocation(query2.from.geometry.location), extractLocation(query2.to.geometry.location))).respond({error: 'No trips found.'});
      httpBackend.whenJSONP(stopsDirection(query3.avoidBuses, extractLocation(query3.from.geometry.location), extractLocation(query3.to.geometry.location))).respond(res1);
    }));

    it('should return error message for blank data', function(){
      runs(function(){
        DirectionsService.getDirections({}, function(data){
          console.log("Success");
        }, function(data){
          console.log("Fail");
          expect(data.msg).toBe("Missing path information");
        });
      });
      waits(300);
    });

    it('should return an internal server error 500', function(){
      runs(function(){
        DirectionsService.getDirections(query1, function(data){
          console.log("Success");
        }, function(data){
          console.log("Fail");
          expect(data).toBe(500);
        });
        httpBackend.flush();
      });
      waits(300);
    });

    it('should return error message on no trips found', function(){
      runs(function(){
        DirectionsService.getDirections(query2, function(data){
          console.log("Success");
        }, function(data){
          console.log("Fail");
          expect(data).toContain('No trips found.');
        });
        httpBackend.flush();
      });
      waits(300);
    });

    it('should return a plan object', function(){
      runs(function(){
        DirectionsService.getDirections(query3, function(data){
          console.log("Success");

          var itineraries = data.itineraries;
          var itinerary1 = itineraries[0].legs[0];
          expect(data).toBeDefined();
          expect(data).toEqual(jasmine.any(Object));
          expect(itineraries).toEqual(jasmine.any(Array));
          expect(itineraries.length).toEqual(1);
          expect(itinerary1.distance).toEqual(249);
          expect(itinerary1.duration).toEqual(207000);
          expect(itinerary1.mode).toEqual('WALK');
          expect(itinerary1.from.name).toEqual('Taft Avenue');
          expect(itinerary1.to.name).toEqual('UN Ave LRT');
        }, function(data){
          console.log("Fail");
        });
        httpBackend.flush();
      });
      waits(300);
    });
  });

});