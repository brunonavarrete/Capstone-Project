function goHome(req,res,next){
	if( req.session && req.session.userId ){
		return res.redirect('/');
	}
	return next();
};

function goLogin(req,res,next){
	if( !req.session || !req.session.userId ){
		return res.redirect('/login');
	}
	return next();
};

module.exports.goHome = goHome;
module.exports.goLogin = goLogin;