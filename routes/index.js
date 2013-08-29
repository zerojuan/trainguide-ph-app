
/*
 * GET home page.
 */


exports.index = function(req, res){
	console.log("Req: " + req.production);
  res.render('index', { title: 'Trainguide.PH', production: req.production});
};

exports.partials = function(req, res){
	var name = req.query.url;
	if(!name){
		res.render('index');
	}else{
		name = name.replace(/\./g,'/');
		res.render(name);
	}
}