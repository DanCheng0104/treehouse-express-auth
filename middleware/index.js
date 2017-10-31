function loggedOut(req,res,next){
	if(req.session && req.session.userId){
		return res.redirect('./profile');
	}
	return next();
}

function loggedIn(req,res,next){
	if(req.session && req.session.userId){
		return next();
	}else{
		const err = new Error('You have to log in first to view profile');
		err.status = 401;
		return next(err);
	}
	
}


module.exports.loggedOut = loggedOut;
module.exports.loggedIn = loggedIn;