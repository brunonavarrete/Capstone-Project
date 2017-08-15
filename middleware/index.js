function loggedIn(req,res,next){
	if( req.session && req.session.userId ){
		return res.redirect('/');
	}
	return next();
};

module.exports.loggedIn = loggedIn;