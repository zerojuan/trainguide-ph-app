
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index', { title: 'Express'});
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