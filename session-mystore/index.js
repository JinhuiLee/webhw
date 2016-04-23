var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var parseurl = require('parseurl');
var myStore = require('./session-myfs.js')(session);

var app = express();

app.use(session({
	secret: 'keyboard cet',
	resave: 'false',
	saveUninitialized: true,
	store: new myStore("session-dir")
}));

app.use(function(req,res,next){
  var views = req.session.views;
  if (!views){
    views = req.session.views = {}
  }

  var pathname = parseurl(req).pathname;
  views[pathname] = (views[pathname]||0)+1;
  next();
});

app.get('/',function(req,res,next){
	res.send("You have viewed this page " + req.session.views["/"] + " times");
});


app.use(cookieParser());


app.get('/read',function(req,res,next){
	res.json(req.cookies);
});

app.get('/write',function(req,res,next){
	res.cookie('my_cookie','hello');
	res.json(req.cookies);
});

app.listen(3000);
console.log("Server running at port : 3000");
