/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('viewer/index', { title: 'TrainguidePH API Viewer'});
};