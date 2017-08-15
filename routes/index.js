'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var List = require('../models/list');
var path = require('path');
var mid = require('../middleware');


// GET root
	router.get('/',function(req,res){
		res.send('../public/index.html');
	});

// GET register, login, logout
	router.get('/register',mid.goHome,function(req,res){
		res.sendFile(path.join(__dirname + '/../public/register.html'));
	});

	router.get('/login',mid.goHome,function(req,res,next){
		res.sendFile(path.join(__dirname + '/../public/login.html'));
	});

	router.get('/logout', function(req, res, next) {
	    req.session.destroy(function (err) {
		  if (err) return next(err)
		  res.redirect('/');
		})
	});

// GET lists
	router.get('/user', function(req, res, next){
		if( req.session && req.session.userId ){
			var userId = '5992085879cc7d1656ef6a26';
			List.find({user:userId})
			.exec(function(err,lists){
				if(err) return next(err);
				var user = {
					id: userId,
					lists: lists
				}
				res.json(user);
			});
		} else {
			var user = null;
			res.json(user);
		}
	});

// GET profile
	router.get('/my-quotes', mid.goLogin, function(req, res, next){
		res.sendFile(path.join(__dirname + '/../public/profile.html'));
	});

// POST register, login
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

// POST quote/list
	router.post('/quote',function(req,res,next){
		if( req.session && req.session.userId ){
			console.log(req.body);
			// add userId
				req.body.user = req.session.userId;
			
			// look for list
				List.findOne({user:req.session.userId,category:req.body.category})
				.exec(function(err,list){
					if(err) next(err);
					// create list if !exists
						if(!list){
							req.body.quotes = [{
								_quote_id: req.body._quote_id,
								quote: req.body.quote,
								author: req.body.author,
								category: req.body.category
							}];
							List.create(req.body,function(err,list){
								res.send(list);
							});
					// save quote to list if exists
						} else {
							var quotes = list.quotes;
							quotes.push(req.body);
							list.update({$set: { quotes: quotes }},function(err,list){
								if(err) return next(err);
								res.send(list);
							});
						}
				});
		} else {
			console.log('you must be logged in');
			res.end();
		}
	});

// PUT lists
	router.put('/lists',function(req,res,next){
		//console.log(req.body);
		List.findOne({_id:req.body._id})
		.exec(function(err,list){
			if(err) return next(err);
			list.update({$set: { quotes: req.body.quotes }},function(err){
				if(err) return next(err);
				res.json(list);
			});
		});
	});

module.exports = router;