var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var PlaceSchema = new Schema({
  name: String,
  line: {
    line_id: ObjectId,
    route_id: String,
    name: String
  },
  stop: {
    stop_id: ObjectId,
    name: String
  },
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