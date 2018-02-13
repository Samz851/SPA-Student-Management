var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var secret = 'Samz851';

module.exports = function(router){

    //User Registration API Route
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        var cond = req.body.username == null || req.body.username == ' ' || req.body.password == null || req.body.password == ' ' || req.body.email == null || req.body.email == ' ';
        if(cond){
            res.json({ success: false, message: 'Please provide all required fields'});
        } else {
            user.save(function(err){
                // Try switch
                // switch (key in err) {
                //     case key == 'email':
                //         res.json({success: false, message: err.email.message});
                //         break;
                //     case key == 'password':
                //         res.json({success: false, message: err.password.message});
                // }


            if(err){
                if(err.errors.hasOwnProperty('email')){
                    res.json({success: false, message: err.errors.email.message}); //We can select specific parts of the Error Object to display -- remember err/error is an object like any other.
                } else if(err.errors.hasOwnProperty('password')){
                    res.json({success: false, message: err.errors.password.message});
                } else if(err.errors.hasOwnProperty('username')){
                    res.json({success: false, message: err.errors.username.message});
                }
                else {
                    res.json({success: false, message: err});
                }

            }else{
                    res.json({success: true, message: 'User Record Created Successfully'})
                }
            });

        }
        
    });
    // User Login API Route
    router.post('/authenticate', function(req, res){
        var cond = req.body.username == null || req.body.username == ' ' || req.body.password == null || req.body.password == ' ';

        if(cond){
            res.json({success: false, message: 'Make sure to fill all fields'});
        }else {
            User.findOne({username: req.body.username}).select('email username password').exec(function(err, user){
                if(err) throw err;
                if(!user){
                    res.json({success:false, message: 'No records found'})
                } else if (user){
                    // password validation
                   var validLogin =  user.passwordMatch(req.body.password);
                   if(!validLogin){
                       res.json({success: false, message: 'Password does not match record'});
                   } else {
                    var date = new Date();
                    date = date.getDate();
                    var token = jwt.sign({
                        username: user.username,
                        email: user.email,
                        date: date
                      }, secret, { expiresIn: '24h' });
                       res.json({success: true, message: 'You are logged in', token: token})
                   }
                }
            })
        }

    });

    router.use(function(req, res, next){
        var localToken = req.body.token || req.body.query || req.headers['x-access-token'];

        if(localToken) {
            jwt.verify(localToken, secret, function(err, decoded) {
                if(err) {
                    res.json({success: false, message: ' Token could not be verified'})
                } else {
                    req.decoded = decoded;
                    next();
                }
              });
        } else {
            res.json({success: false, message: 'no token provided'});
        }
    });

    router.post('/active', function(req, res){
       res.send(req.decoded);
    })
    return router;
}