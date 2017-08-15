'use strict';

var mongoose = require('mongoose'),
	mongooseValidate = require('mongoose-validate'),
	bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [mongooseValidate.email, 'invalid email address']
	},
	password: {
		type: String,
		required: true
	},
});

UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.hash(user.password,10,function(err,hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

// authenticate input against db
	UserSchema.statics.authenticate = function(email, password, callback){
		User.findOne({ email: email })
		.exec(function(err, user){
			if(err){
				return callback(err);
			} else if( !user ) {
				var err = new Error('user does not exist');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function(error, result){
				if( result === true ){
					return callback(null, user); // null = error
				} else {
					return callback();
				}
			});
		});
	}

var User = mongoose.model('User',UserSchema);

module.exports = User;