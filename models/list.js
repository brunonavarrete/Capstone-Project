'use strict';

var mongoose = require('mongoose'),
	mongooseValidate = require('mongoose-validate');

var Schema = mongoose.Schema;

var ListSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
	category: String,
	quotes: []
});

var List = mongoose.model('List',ListSchema);

module.exports = List;