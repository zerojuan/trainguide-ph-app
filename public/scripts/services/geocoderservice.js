angular.module('trainguideServices')
.factory('GeocoderService', ['$http', function($http){
  var GeocoderService = {};

  GeocoderService.geocode = function(latLng, callback, err){
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'latLng': latLng}, function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        console.log(results);
        results[0].geometry.location = latLng;
        callback(results);
      }else{
        console.log("Geocoder failed: " + status);
        err(status);
      }
    });
  };

  return GeocoderService;
}])