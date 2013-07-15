var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  name: String,
  station: String,
  distance: String,
  map: String,
  coordinates: {
    lng: Number,
    lat: Number
  },
  category: String
});

module.exports = mongoose.model('Place', PlaceSchema);