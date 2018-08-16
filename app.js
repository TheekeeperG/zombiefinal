var express = require('express');
var mongoose = require('mongoose');

var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var passport = require('passport');
var routes = require('./routes');
var passportsetup = require("./passportsetup");
var app = express();

mongoose.connect('mongodb://localhost:27017/zombie_nest');

passportsetup();

app.set("port",process.env.PORT||3000);


app.set("views",path.resolve(__dirname,"views"));
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extends: false}));
app.use(cookieParser());
app.use(session({
    secret: "IASNjvwnfwdsDNASDNJsjnf!Es12131#€sd€dfad1241",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize({
    userProperty: "zombie"
}));


app.use(passport.session());


app.use(routes);

app.listen(app.get('port'),()=>{
    console.log("Tu wea corriendo en el puerto: "+app.get('port'));
});