'use strict';

describe('Service: FaresService', function(){

  beforeEach(module('trainguideServices'));

  var FaresService,
      httpBackend;

  describe('getPUJ function', function(){
    beforeEach(inject(function($httpBackend, _FaresService_){
      httpBackend = $httpBackend;
      FaresService = _FaresService_;

      var response = {
        "matrix": [
            [8, 6.5],
            [8, 6.5],
            [8, 6.5],
            [8, 6.5],
            [9.5, 7.5],
            [10.75, 8.75],
            [12.25, 9.75],
            [13.5, 11],
            [15, 12],
            [16.5, 13.25],
            [17.75, 14.25],
            [19.25, 15.5],
            [20.5, 16.5],
            [22, 17.75],
            [23.5, 18.75],
            [24.75, 19.75],
            [26.25, 21],
            [27.5, 22.25],
            [29, 23.25],
            [30.5, 24.5],
            [31.75, 25.5],
            [33.25, 26.75],
            [34.5, 27.75],
            [36, 28.75],
            [37.5, 30],
            [38.75, 31],
            [40.25, 32.25],
            [41.5, 33.25],
            [43, 34.5],
            [44.5, 35.5],
            [45.75, 36.75],
            [47.25, 37.75],
            [48.5, 38.75],
            [50, 40],
            [51.5, 41.25],
            [52.75, 42.25],
            [54.25, 43.5],
            [55.5, 44.5],
            [57, 45.75],
            [58.5, 46.75],
            [59.75, 47.75],
            [61.25, 49],
            [62.5, 50],
            [64, 51.25],
            [65.5, 52.5],
            [66.75, 53.5],
            [68.25, 54.75],
            [69.5, 55.75],
            [71, 56.75],
            [72.5, 58]
          ]};

      httpBackend.whenGET('data/puj.data.json').respond(response);
    }));

    it('should get the PUJ data', function(){
      runs(function(){
        FaresService.getPUJ(function(data){
          console.log("Success");

          expect(data).toEqual(jasmine.any(Object));
          expect(Object.keys(data).length).toEqual(1);
          expect(data.matrix).toBeDefined();

          var matrix = data.matrix;

          expect(matrix).toEqual(jasmine.any(Array));
        }, function(data){
          console.log("Fail");
        });

        httpBackend.flush();
      });
      waits(300);
    });
  });
});