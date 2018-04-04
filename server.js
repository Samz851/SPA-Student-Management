var express = require('express');
var app = express();
var logger = require('morgan');
var fs = require('fs');
var mongoose = require('mongoose');
var router = express.Router();
var routes = require('./app/routes/api.js')(router);
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var socialLogin = require('./app/passport/passport.js')(app, passport);
// var autoIncrement = require('mongoose-auto-increment');

//middleware
app.use(logger('dev'));
app.use(logger('common', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/api',routes);

mongoose.connect('mongodb://stdntApp:stdntApp851@ds233769.mlab.com:33769/stdntmgmt', function(err){
    if(err){
        console.log('Connection to DB failed');
    }else{
        console.log('Connection to Database Successful');        
    }
});
    
// Routes
app.get('*', function(req, res, err){
    res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
});

var server = app.listen(process.env.PORT || 3100, function(){
    var port = this.address().port;
    console.log ('App server listening on port ' + port);
});
