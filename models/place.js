var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  name: String,
  station: String,
  distance: String,
  website: String,
  map: String,
  coordinates: {
    lng: Number,
    lat: Number
  },
  category: String
});

module.exports = mongoose.model('Place', PlaceSchema);