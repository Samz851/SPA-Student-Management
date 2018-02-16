var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var secret = 'Samz851'; 
var nodemailer = require("nodemailer");

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
                    res.json({success: true, message: 'User Record Created Successfully'})
                }
            });
        }
    });

    // Email Activation APIs
    router.post('/sendactivation', function(req, res){
        console.log('the request raw is as follows: \n' +req.body.email+'\n The end of the header');
        var email= req.body.email;
        var emailtoken = jwt.sign({
            username: req.body.username,
            email: req.body.email,
          }, secret, { expiresIn: '72h' });
        // find user
        User.findOne({email: req.body.email}).select('temptoken').exec(function(err, user){
            if(err){
                console.log(err);
            }else{
                user.temptoken = emailtoken;
                user.save((err, user) => {
                    if (err) {
                        console.log('could not save token');
                    }else{
                        console.log('token saved in database');
                    }
                });
            }
        });
        verifyurl="http://127.0.0.1:3000/api/verifyemail";
        link=verifyurl+'?id='+emailtoken;
        mailOptions={
            to : email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        }
        console.log(mailOptions);
        let mailTransporter = nodemailer.createTransport({
            service: 'Mailgun',
            auth: {
                api_key: 'key-be742a5d437c8958e763f1a361003941',
                domain: 'sandboxd3612106dbc141b7a5134f0fddce769a.mailgun.org',
                user: 'postmaster@sandboxd3612106dbc141b7a5134f0fddce769a.mailgun.org',
                pass: '12345',
                secure: false,
            }
        });
        mailTransporter.sendMail(mailOptions, function(err, res){
            if(error){
                console.log(error);
                res.end("error");
            }else{
                console.log("Message sent: " + res);
                res.end("sent");
            }
        });
    })
    router.get('/verifyemail',function(req,res){
        console.log(req.headers);
        verifytoken = req.query.id;
        tokenemail=''
        jwt.verify(verifytoken, secret, function(err, decoded){
            if(err){
                console.log('could not decode token');
            } else{
                tokenemail = decoded.email;
            }
        });
        User.findOne({email: tokenemail}).select('isverified temptoken').exec(function(err, user){
            if(err){
                console.log('could not find record');
            }else {
                if(req.query.id==user.temptoken){
                    user.isverified = true;
                    user.save(function(err, user){
                        res.json({message: 'email tokens match and account is verified'})
                    })
                }else{
                    res.json({message:'tokens do not match'});
                }

            }
        })
    })

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
            console.log('no username picked yet')
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
            console.log('no email sent')
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
        }
    });

    router.post('/active', function(req, res){
       res.send(req.decoded);
    });
    

    return router;
}