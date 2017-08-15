'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var List = require('../models/list');
var path = require('path');
var mid = require('../middleware');

router.get('/',function(req,res){
	res.send('../public/index.html');
});

router.get('/register',mid.loggedIn,function(req,res){
	res.sendFile(path.join(__dirname + '/../public/register.html'));
});

router.get('/login',mid.loggedIn,function(req,res,next){
	res.sendFile(path.join(__dirname + '/../public/login.html'));
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function (err) {
	  if (err) return next(err)
	  res.send('destroyed');
	})
});

router.post('/login',function(req,res,next){
	User.authenticate(req.body.email,req.body.password,function(err, user){
      if( err || !user ){
        var err = new Error('Wrong email or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id; // creates req.session and gives it userId property
        return res.redirect('/');
      }

    });
});

router.post('/register',function(req,res,next){
	var user = req.body;
	User.create(user,function(err,user){
		if(err){
			return res.status(500).json({message:err.message});
		}
		req.session.userId = user._id; // creates req.session and gives it userId property
		return res.redirect('/');
	});
});

router.post('/quote',function(req,res,next){
	if( req.session && req.session.userId ){
		req.body.category = 'Code';
		req.body.user = req.session.userId;
		List.findOne({user:req.session.userId,category:req.body.category})
		.exec(function(err,list){
			if(err) next(err);
			if(!list){
				req.body.quotes = [{
					quote: 'Quote lalala lorem ipsum',
					author: 'Yo',
					_quote_id: 1
				}]
				List.create(req.body,function(err,list){
					res.send(list);
				})
			} else {
				var new_quote = {
					quote: 'Sa sa sa yakusa, yakusa',
					author: 'Mesa',
					_quote_id: 234567
				};
				var quotes = list.quotes;
				quotes.push(new_quote);
				list.update({$set: { quotes: quotes }},function(){
					res.send(list);
				});
				console.log(list.quotes);
			}
		});
	} else {
		console.log('you must be logged in');
		res.end();
	}
});

module.exports = router;