var User = require('../models/user.js');
var Class = require('../models/classes.js');
var jwt = require('jsonwebtoken');
var secret = 'Samz851'; 
var Student = require('../models/students.js');
var eTemplate = require('../models/etemplates.js');

module.exports = function(router){

    

   

    //User Registration API Route
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.firstname + req.body.lastname;
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
                        res.json({success:false, message: err});}
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
            });
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
            });
        } else {
            return;
        }
        
    });
    //email activation
    router.put('/verifyemail/:token',function(req, res){
        User.findOne({temptoken: req.params.token}).select('isverified temptoken username password').exec(function(err, user){
            if(err) throw err;
            var token = req.params.token;
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({success: false, message: ' token expired'});
                } else if(!user) {
                    res.json({success:false, message: 'account could not be found'});
                } else {
                    user.isverified = true;
                    user.temptoken = 'verified';
                    user.save(function(err){
                        if(err) throw err;
                        res.json({success: true, message: 'email tokens match and account is verified'});
                    });
                }
            });

        });
    });

    // Resend Username
    router.put('/resendusername/:email', function(req, res){
        var email = req.params.email;
        if(email === null){
            res.json({success:false, message: "No email"});
        }
        User.findOne({email: email}).select('username').exec(function(err, user){
            if(!user) {
                res.json({success: false, message:"No user found with this email"});
            } else {
                eTemplate.resendUsername(email, user);
                res.json({success: true, message: "Username sent to email"});
            }            
        });
    });

    // Send Password Link
    router.put('/sendpasswordtoken/:email', function(req, res){
        var email = req.params.email;
        User.findOne({email: email}).select('firstname temptoken').exec(function(err, user){
            if(!user) {
                res.json({success: false, message:"No user found with this email"});
            } else {
                firstname = user.firstname;
                token = jwt.sign({ firstname: firstname, email: email}, secret, { expiresIn: '72h' });
                user.temptoken = token;
                var sendUserinfo = eTemplate.resendPassword(email, firstname, token);
                if(err) {
                    res.json({success:false, message: "Reset Failed, Please contact us"});                    
                } else {
                    user.save(function(err){
                        if(err){
                            res.json({success: false, message: "Reset token was not saved, please retry the password reset"});
                        } else {
                            res.json({success:true, message: "Password reset link was sent to your email"});
                        }
                    });
                }
            }
        });
    });

    // Reset Password Route
    router.post('/resetpassword/:token',function(req, res){
        User.findOne({temptoken: req.params.token}).select('temptoken username password').exec(function(err, user){
            if(err) throw err;
            var token = req.params.token;
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({success: false, message: ' token expired'});
                } else if(!user || user.username !== req.body.username) {
                    res.json({success:false, message: 'account could not be found'});
                } else {
                    user.temptoken = 'verified';
                    user.save(function(err){
                        if(err) throw err;
                        res.json({success: true, message: 'email tokens match and reset was successful'});
                    });
                }
            });

        });
    });

    // User Login API Route
    router.post('/authenticate', function(req, res){
        var cond = req.body.username == null || req.body.username == ' ' || req.body.password == null || req.body.password == ' ';

        if(cond){
            res.json({success: false, message: 'Make sure to fill all fields'});
        }else {
            User.findOne({username: req.body.username}).select('firstname lastname username password role').exec(function(err, user){
                if(err) throw err;
                if(!user){
                    res.json({success:false, message: 'No records found'});
                } else if (user){
                    // password validation
                   var validLogin =  user.comparePassword(req.body.password);
                   if(!validLogin){
                       res.json({success: false, message: 'Password does not match record'});
                   } else {
                    var name = user.firstname +" "+user.lastname;
                    var date = new Date();
                    date = date.getDate();
                    var token = jwt.sign({
                        username: user.username,
                        name: name,
                        role: user.role,
                        date: date
                      }, secret, { expiresIn: '1h' });
                       res.json({success: true, message: 'You are logged in', token: token, username: user.username, role : user.role});
                   }
                }
            });
        }

    });
    

    // Json Web Tokens verification == to keep user logged in
    router.use(function(req, res, next){
        var localToken = req.body.token || req.body.query || req.headers['x-access-token'];

        if(localToken) {
            jwt.verify(localToken, secret, function(err, decoded) {
                if(err) {
                    res.json({success: false, message: ' Token could not be verified'});
                } else {
                    req.decoded = {success: true,
                                    decoded: decoded};
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
                var newToken = jwt.sign({ username: user.username, email: user.email, session: "renewed" }, secret, { expiresIn: '1h' }); // Give user a new token
                res.json({ success: true, message: "token refreshed", token: newToken }); // Return newToken in JSON object to controller
            }
        });
    });


    ////////////DASHBOARD APIS//////////
     //Fetch All Classes
    router.get('/adminapi/classlist', function(req, res){
        Class.find({}).populate('enrolled').exec(function(err, course){
            if(err) {
                //Handle Error
            } else {
                res.json({success:true, course});
            }
        });

    });
     //Add New Class
     router.post('/adminapi/addnewclass', function(req, res, err){
         if(!req.body){
             //handle error
             res.json({ success: false, message: 'Could not add'});
         } else {
            var newclass = new Class();
            newclass.classCode = req.body.courseCode;
            newclass.className = req.body.courseTitle;
            newclass.classDesc = req.body.courseDesc;
            newclass.classStart = req.body.courseStart;
            newclass.classDuration = req.body.courseDuration;
            if(!req.body){
            res.json({ success: false, message: 'Please provide all required fields'});
            } else {
                newclass.save(function(err){
                    if(err) {
                        // handle error
                    } else {
                        res.json({ success: true, message: 'Class added'});
                    }
                });
            }
        }
    });

    //Add New Student
    router.post('/adminapi/addnewstudent', function(req, res, err){
        if(!req.body){
            //handle error
            res.json({ success: false, message: 'Could not add'});
        } else {
           var student = new Student();
           student.name = req.body.name;
           student.email = req.body.email;
           if(!req.body){
           res.json({ success: false, message: 'Please provide all required fields'});
           } else {
               student.save(function(err){
                   if(err) {
                       // handle error
                   } else {
                       res.json({ success: true, message: 'student added'});
                   }
               });
           }
       }
   });

   //Enroll Student in Class
   router.post('/adminapi/addtoclass', function(req, res, err){
    var studentID = req.body.studentid;
    var studentcourse = req.body.coursecode;
    var obj = {
        class: studentcourse,
        score: [{type: 'hw', score: 0.00},
        {type: 'qz', score: 0.00},
        {type: 'md', score: 0.00},
        {type: 'fn', score: 0.00}]
    };
    var enrolledstudent = {};
       if(!req.body){
           // handle error
           res.json({ success: false, message: 'Failed to enroll'});
       } else {            
            Student.findOne({studentid: studentID}).select('_id academic').exec(function(err, student){
                if(err){
                    res.json({success: false, message: 'student not found'})
                }else{

                    res.json({success: true, message: 'Student Enrolled'})
                    // student.academic.class = studentcourse;
                    enrolledstudent = student;
                    classList = student.academic;
                    classList.push(obj);
                    pushStudent(student);
                    student.save(function(err){
                        // handle error
                    
                    });
                }
           });
           var pushStudent = function (student){
                Class.findById(req.body.coursecode).select('enrolled').exec(function(err, course){
               course.enrolled.push(enrolledstudent._id);
               course.save(function(err){
                   // handle error
               });
           });

           };
           
        }
   });

   //Fetch Student Records
   router.get('/adminapi/getstdrec/:studentid', function(req, res, err){
       Student.findOne({studentid: req.params.studentid}).
       populate('academic.class').
       exec(function(err, student){
           if(student){
               if(student.academic.length > 0) {
                var grade;
                student.finalGrade().then(function(data){
                    grades = data;
                    res.json({success: true, student: student, final: grades})
                })
               } else if(student.academic.length == 0) {
                    res.json({success: false, message: 'Student not enrolled in any class'})
               }
           }else{
               res.json({success: false, message: 'No student found with this #ID'})
           }
       })
   })

   //Update student Record
   router.put('/adminapi/updatestdrec', function(req, res, err){
       let n = false;
       let e = false;
       let scoreCorrections = [];
        Student.findOne({'studentid': req.body.ID}).exec(function(err, student){
            if(student){
                for( i=0; i < req.body.courses.length; i++){
                    for(c=0; c < student.academic.length; c++){
                        for(s=0; s < student.academic[c].score.length; s++){
                            if(student.academic[c].score[s]._id == req.body.courses[i]._id){
                                student.academic[c].score[s].score = req.body.courses[i].score
                            }
                        }
                    }
                }
            }
            student.save(function(err){
                res.json({success:true, message: 'Record Updated'})
            })
        })
    })
   //Get Class Card
   router.get('/adminapi/getclass/:code', function(req, res, err){
       Class.findOne({'classCode' : req.params.code}).populate('enrolled').select('classCode className classDesc classStart classDuration enrolled.name enrolled.academic.score.type enrolled.academic.score.score').exec(function(err, card){
           if(card){
               res.json({success: true, card: card})
           } else {
               res.json({success: false, message: 'No Course Found'})
           }
       })
   })

   //Update Class Record
   router.put('/adminapi/updateclass', function(req, res, err){
       Class.findOne({classCode : req.body.classCode}).exec(function(err, course){
           console.log(req.body.classCode)
        //    console.log(course)
           course.classCode = req.body.classCode,
           course.className = req.body.className,
           course.classDesc = req.body.classDesc,
           course.classStart = req.body.classStart,
           course.classDuration = req.body.classDuration
           course.save(function(err){
            res.json({success: true, message: 'Class record updated'})
           });
       });
   });

   //Post student marks
   router.post('/adminapi/submitmark', function(req, res, err){
       Student.findOne({name: req.body.name}).populate('academic academic.class').exec(function(err, student){
            for ( var index of student.academic) {
                console.log(index.class._id + ' : ' + req.body.classroom)
                if(index.class._id == req.body.classroom){
                    student.academic.id(index._id).score.push({type: req.body.type, score: req.body.mark})
                } else {
                    // handle error
                }
            }
           student.save(function(err){
            res.json({success:true, message:'Marks submitted'})
           });
       });
   });

   //Get all marks
   router.get('/adminapi/allmarks', function(req, res, err){
        let marks =[];
        Student.find({}).
        select('name academic').
        populate('academic.class').
        exec(function(err, students){
            // console.log(students)
            for( student of students){
                student.finalGrade().then(function(data){
                    for(var i = 0; i < data.length; i++){
                        grade = {name: data[i].name, final: data[i].final}
                    marks.push(grade)
                    }
                })
            }
            setTimeout(function(){
                res.json({success: true, marks: marks})
            }, 400)
        })
    })



    return router;
}