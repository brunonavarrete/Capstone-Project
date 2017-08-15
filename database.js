var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/quotes',{ useMongoClient:true });

var db = mongoose.connection;
db.on('open',function(){
	console.log('connection opened');
});