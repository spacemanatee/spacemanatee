var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = require('./server/router');
var passport = require('./server/authentication/authentication');
var cookieParser = require('cookie-parser');
var session = require('express-session')

//set port variable to deployed port or 3456 for local host
var port = process.env.PORT || 3456;

//set dirname to client folder to serve static assets (index.html)
app.use('/', express.static(__dirname + '/client'));

//parses all incoming data from strings to JSON
app.use(cookieParser());
app.use(bodyParser.json());

//Send all calls to router function
app.use(session({secret: "secret"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.listen(port, function() {
  console.log("Listening on port " + port + "...");
});


