'use strict';

describe('Service: LinesService', function(){

  beforeEach(module('trainguideServices'));

  var LinesService,
      httpBackend;

  describe('getLines functions', function(){
    beforeEach(inject(function($httpBackend, _LinesService_){
      httpBackend = $httpBackend;
      LinesService = _LinesService_;

      var response = {
        "LRT1": {
          "route_id": "ROUTE_880747",
          "shortName": "LRT 1",
          "longName": "Baclaran - Roosevelt",
          "description": "Urban railway line serving 20 stations between Balaran and Roosevelt",
          "url": "http://www.lrta.gov.ph/train_operating_schedules.php",
          "fare": [12, 12, 12, 12, 15, 15, 15, 15],
          "stops": [
            {
              "trip_id": "882210",
              "stop_sequence": 1,
              "stop_id": "LTFRB_4944",
              "arrival_time": "00:00:00",
              "departure_time": "00:00:00",
              "stop_headsign": "",
              "route_short_name": "",
              "pickup_type": "0",
              "drop_off_type": "0",
              "shape_dist_traveled": "",
              "agency_key": "philippines",
              "_id": "51ea970c70c336c76e000eab",
              "details": {
                "stop_id": "LTFRB_4944",
                "stop_code": "",
                "stop_name": "Baclaran LRT",
                "stop_desc": "",
                "stop_lat": 14.5339,
                "stop_lon": 120.998,
                "zone_id": "",
                "stop_url": "",
                "location_type": "0",
                "parent_station": "",
                "wheelchair_boarding": "0",
                "stop_direction": "",
                "agency_key": "philippines",
                "_id": "51ea971b70c336c76e014435",
                "loc": [
                    120.998,
                    14.5339
                ]
              }
            }
          ]
        }, 
        "LRT2": {}, 
        "MRT": {}, 
        "PNR": {}
      };

      httpBackend.whenGET('data/lines.data.json').respond(response);
    }));

    it('should get the lines data', function(){
      runs(function(){
        LinesService.getLines(function(data){
          console.log("Success");

          expect(data).toEqual(jasmine.any(Object));
          expect(Object.keys(data).length).toEqual(4);
          expect(data.LRT1).toBeDefined();
          expect(data.LRT2).toBeDefined();
          expect(data.MRT).toBeDefined();
          expect(data.PNR).toBeDefined();

          var data1 = data.LRT1;

          expect(data1.route_id).toBeDefined();
          expect(data1.shortName).toBeDefined();
          expect(data1.longName).toBeDefined();
          expect(data1.description).toBeDefined();
          expect(data1.url).toBeDefined();
          expect(data1.fare).toBeDefined();
          expect(data1.stops).toBeDefined();

          var stops1 = data1.stops[0];

          expect(stops1.trip_id).toBeDefined();
          expect(stops1.stop_sequence).toBeDefined();
          expect(stops1.stop_id).toBeDefined();
          expect(stops1.arrival_time).toBeDefined();
          expect(stops1.departure_time).toBeDefined();
          expect(stops1.stop_headsign).toBeDefined();
          expect(stops1.route_short_name).toBeDefined();
          expect(stops1.pickup_type).toBeDefined();
          expect(stops1.drop_off_type).toBeDefined();
          expect(stops1.shape_dist_traveled).toBeDefined();
          expect(stops1.agency_key).toBeDefined();
          expect(stops1._id).toBeDefined();
          expect(stops1.details).toBeDefined();
        }, function(data){
          console.log("Fail");
        });

        httpBackend.flush();
      });
      waits(300);
    });
  });
});