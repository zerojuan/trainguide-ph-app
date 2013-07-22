
var constants = require('../constants'),
		async = require('async');

exports.generateStaticData = function(req, res){
	var trainAgencies = constants.AGENCIES;

	//get route from each agency
	async.parallel([
		function(callback){
			//LRTA
		},
		function(callback){
			//MRTC
		},
		function(callback){
			//PNR
		}
	],
	function(err, results){

	});

	//get array of stops from each route

	//get shape data from each array of stops

	//construct a json file out of it


	res.send({
		status: 'OK'
	});
}