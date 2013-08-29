var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var LineDetails = new Schema({
	route_id: String,
	weekdays: String,
	weekend: String,
	contact: String,
	email: String,
	fare: String,
	svc: String,
	twitter: String,
	web: String
});

module.exports = mongoose.model('LineDetails', LineDetails);