var express = require('express');
var app = express();
var logger = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var routes = require('./app/routes/api.js')(router);
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var socialLogin = require('./app/passport/passport.js')(app, passport);

//middleware
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/api',routes);

mongoose.connect('mongodb://127.0.0.1:27017/usermgmt', function(err){
    if(err){
        console.log('Connection to DB failed \n' + err);
    }else{
        console.log('Connection to Database Successful');
    }
});

// Routes
app.get('*', function(req, res, err){
    res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
})

app.listen(process.env.PORT || 3000, function(){
    var port = this.address().port;
    console.log ('App server listening on port ' + port);
});