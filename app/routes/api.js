var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var secret = 'Samz851'; 
// var nodemailer = require("nodemailer");
var eTemplate = require('../models/etemplates.js');

module.exports = function(router){

    //User Registration API Route
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.temptoken = jwt.sign({ username: req.body.username, email: req.body.email,}, secret, { expiresIn: '72h' });
        var cond = req.body.username == null || req.body.username == ' ' || req.body.password == null || req.body.password == ' ' || req.body.email == null || req.body.email == ' ';
        if(cond){
            res.json({ success: false, message: 'Please provide all required fields'});
        } else {
            user.save(function(err){
                if(err) {
                    if(err.errors != null){
                        if(err.errors.hasOwnProperty('email')){
                            res.json({success: false, message: err.errors.email.message}); //We can select specific parts of the Error Object to display -- remember err/error is an object like any other.
                        } else if(err.errors.hasOwnProperty('password')){
                            res.json({success: false, message: err.errors.password.message});
                        } else if(err.errors.hasOwnProperty('username')){
                            res.json({success: false, message: err.errors.username.message});
                        } else if(err.errors.hasOwnProperty('firstname')){
                            res.json({success: false, message: err.errors.firstname.message});
                        } else if(err.errors.hasOwnProperty('lastname')){
                            res.json({success: false, message: err.errors.lastname.message});
                        }
                    } else if(err.code == 11000) {
                        var message = err.errmsg.split(' ');
                        var msgString = message.toString();
                        if(msgString.indexOf('username') > -1){
                            res.json({success: false, message: 'Username Already Exist '});
                        } else if (msgString.indexOf('email' > -1)){
                            res.json({success: false, message: 'Email Already Exist '});
                        }
                    } else {
                        res.json({success:false, message: err})};
                } else {
                    res.json({success: true, message: 'User Record Created Successfully'});
                    eTemplate.activationEmail(user.temptoken, user.email);
                }
            });
        }
    });

    //Username & Email Check API
    router.post('/checkusername', function(req,res){
        if(req.body.username){
            User.findOne({username: req.body.username}).select('username').exec(function(err, user){
                if(user){
                    res.json({success: false, message: 'Username Already Taken'});
                } else {
                    res.json({success: true, message: 'Username Available'});
                }
            })
        } else {
            return;
        }

    });
    router.post('/checkuseremail', function(req ,res ){
        if(req.body.email){
            User.findOne({email: req.body.email}).select('email').exec(function(err, user){
                if(user){
                    res.json({success: false, message: 'Email Already exist with an account. Try Forgot Password'});
                } else {
                    res.json({success: true, message: ''});
                }
            })
        } else {
            return;
        }
        
    });
    //email activation
    router.put('/verifyemail/:token',function(req, res){
        User.findOne({temptoken: req.params.token}).select('isverified temptoken username password').exec(function(err, user){
            if(err) throw err
            var token = req.params.token;
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({success: false, message: ' token expired'})
                } else if(!user) {
                    res.json({success:false, message: 'account could not be found'});
                } else {
                    user.isverified = true;
                    user.temptoken = 'verified';
                    user.save(function(err){
                        if(err) throw err;
                        res.json({success: true, message: 'email tokens match and account is verified'})
                    })
                }
            });

        })
    });

    // Resend Username
    router.put('/resendusername/:email', function(req, res){
        var email = req.params.email;
        if(email === null){
            res.json({success:false, message: "No email"})
        }
        User.findOne({email: email}).select('username').exec(function(err, user){
            if(!user) {
                res.json({success: false, message:"No user found with this email"})
            } else {
                eTemplate.resendUsername(email, user);
                res.json({success: true, message: "Username sent to email"})
            }            
        })
    });

    // Send Password Link
    router.put('/sendpasswordtoken/:email', function(req, res){
        var email = req.params.email;
        User.findOne({email: email}).select('firstname temptoken').exec(function(err, user){
            if(!user) {
                res.json({success: false, message:"No user found with this email"})
            } else {
                firstname = user.firstname
                token = jwt.sign({ firstname: firstname, email: email}, secret, { expiresIn: '72h' });
                user.temptoken = token
                var sendUserinfo = eTemplate.resendPassword(email, firstname, token)
                if(err) {
                    res.json({success:false, message: "Reset Failed, Please contact us"})                    
                } else {
                    user.save(function(err){
                        if(err){
                            res.json({success: false, message: "Reset token was not saved, please retry the password reset"})
                        } else {
                            res.json({success:true, message: "Password reset link was sent to your email"});
                        }
                    })
                }
            }
        })
    })

    // Reset Password Route
    router.post('/resetpassword/:token',function(req, res){
        User.findOne({temptoken: req.params.token}).select('temptoken username password').exec(function(err, user){
            if(err) throw err
            var token = req.params.token;
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({success: false, message: ' token expired'})
                } else if(!user || !user.username == req.body.username) {
                    res.json({success:false, message: 'account could not be found'});
                } else {
                    user.temptoken = 'verified';
                    user.save(function(err){
                        if(err) throw err;
                        res.json({success: true, message: 'email tokens match and reset was successful'})
                    })
                }
            });

        })
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
                   var validLogin =  user.comparePassword(req.body.password);
                   if(!validLogin){
                       res.json({success: false, message: 'Password does not match record'});
                   } else {
                    var date = new Date();
                    date = date.getDate();
                    var token = jwt.sign({
                        username: user.username,
                        email: user.email,
                        date: date
                      }, secret, { expiresIn: '60s' });
                       res.json({success: true, message: 'You are logged in', token: token})
                   }
                }
            })
        }

    });
    

    // Json Web Tokens verification == to keep user logged in
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
            next();
        }
    });

    router.post('/active', function(req, res){
       res.send(req.decoded);
    });

    // Route to provide the user with a new token to renew session
    router.get('/renewToken/:username', function(req, res) {
        User.findOne({ username: req.params.username }).select('username email').exec(function(err, user) {
            // Check if username was found in database
            if (!user) {
                res.json({ success: false, message: 'No user was found' }); // Return error
            } else {
                var newToken = jwt.sign({ username: user.username, email: user.email, session: "renewed" }, secret, { expiresIn: '90s' }); // Give user a new token
                res.json({ success: true, message: "token refreshed", token: newToken }); // Return newToken in JSON object to controller
            }
        })
    });
    

    return router;
}