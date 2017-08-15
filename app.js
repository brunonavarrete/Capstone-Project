var express = require('express');
var app = express();
var logger = require('morgan');
var router = require('./routes/index');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); // connect-mongo will access our sessions

// middleware
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

// static
	app.use(express.static('public'));

// database
  mongoose.connect('mongodb://localhost:27017/quotes');
  var db = mongoose.connection;

// session
  app.use(session({
    secret: 'Ohana means family',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db // mongoose.connection
    })
  }));

//
  db.on('open',function(){
      console.log('connection opened');
  });


// router
  app.use('/',router);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //console.log('error!');
  res.send(err);
});


app.listen(3000,function(){
	console.log('listening on port 3000');
});