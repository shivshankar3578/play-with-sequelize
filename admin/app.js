var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var crypto = require('crypto');
var url = require("url");
var moment = require('moment');
const nunjucks = require('nunjucks');
const multipart = require('connect-multiparty');
const methodOverride = require('method-override')
const sequelize = require('sequelize');
require('dotenv').load();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const sha1 = require('sha1');
global.fs = require('fs');
global.path = require('path');
global.util = require('util');
global.randomString = require("randomstring");
global.flash = require('connect-flash');
global.baseurl = process.env.baseurl
global.UPLOAD_PATH = process.env.UPLOAD_PATH
global.SALT_FACTOR = process.env.SALT_FACTOR

//	config debug
var debug = require('debug');
Object.keys(console).forEach((v) => {
	d = debug(`test:${v}`);
	debug[v] = console.log.bind(console);
	console[v] = d;
})
global.cservice = require("../app/apn")
global.defaults = require('../defaults');
global.FX = require('../utils/fx.js');
global.PX = require('../utils/px.js');
global.FlushError = require('../utils/error.js');


var models = require('../models');
 Object.keys(models).forEach((name)=> {
		var Name = name.charAt(0).toUpperCase() + name.slice(1);
		global[Name] = models[name]
})

var index = require('./routes/index');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');

var env = nunjucks.configure('admin/views', {
	autoescape: true,
	watch: true,
	express: app
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser(process.env.SITE_TITLE));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
	cookie: {
		maxAge: 60000000
	},
	resave: false,
	saveUninitialized: false,
	secret: process.env.SITE_TITLE
}));
app.use(multipart());
app.use(methodOverride())
app.use(flash());


app.use(function(req, res, next) {
	//  console.log(req.flash('error'),req.flash('message') );
	res.locals.error = req.flash('error').toString()
	res.locals.host = process.env.HOST
	res.locals.user = req.session.user

	next();
});

//	non auth function are here
app.use('/admin/', index);
//	auth start
app.use((req, res, next) => {
	console.log("auth stage called");
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	if(!req.session.user)
		return res.redirect("/admin/login");
	next();
});

console.log(defaults.ctrls[8].name);
app.use('/admin/*', (req, res, next)=>{

	var ctrl = req.baseUrl.split('/')[2]
	var method = req.baseUrl.split('/')[3]
	if(!ctrl) ctrl = 'index'
	if(!method) method = 'index'
	var user  = req.session.user
	// var user  = req.session.user  ? req.session.user   : {}
	res.locals.defaults = defaults
	if(user.userType==1 && user.superadmin){   
			res.locals.theme =  'green'
			res.locals.allowCtrls  = 	defaults.ctrls.slice(1,14)
	}
	else if(user.userType==1){    
		res.locals.theme =  'light-green'
		res.locals.allowCtrls  = defaults.ctrls.slice(2,14)
	}
	else if(user.userType==2){    
		res.locals.theme =  'blue'
		res.locals.allowCtrls  = 	defaults.ctrls.slice(3,10)
		res.locals.allowCtrls[0]  = defaults.ctrls[0]
	}else if(user.userType==3) {  
		res.locals.theme =  'deep-purple' 
		res.locals.allowCtrls  = defaults.ctrls.slice(4,10)
	}
	else
		return next(new Error("Someting went wrong"))
	res.locals.ctrl = ctrl
	res.locals.method = method
	console.dir({ ctrl: ctrl, method:method});
		next()
});
//	now all below routes need auth
fs.readdirSync(path.join(__dirname, 'routes'))
	.forEach(function(filename) {
		if (filename.indexOf('.') != 0 || filename != 'index.js') {
			var route = require(path.join(__dirname, 'routes', filename))
			app.use('/admin/', route);
		}
	});


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
// 	var err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

// error handlers

app.use(function(err, req, res, next) {
	console.error("app error handler called", err);
	//	change message for production mode
	
	if(err instanceof Error)
		req.flash('error', err.message);

	// if (req.app.get('env') != 'development')
	// 	var err = {
	// 		message: "Someting went wrong"
	// 	};
	// res.locals.error = err.message;
	// res.locals.message = err.message;
	// res.status(err.status || 500);

	// if(err instanceof FlushError)
	// 	req.flash('error', err.message);

	if (req.headers.referer)
		return res.redirect(req.headers.referer);

});

module.exports = app;
