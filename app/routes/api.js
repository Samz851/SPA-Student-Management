var User = require('../models/user.js');

module.exports = function(router){
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        var cond = req.body.username == null || req.body.username == ' ' || req.body.password == null || req.body.password == ' ' || req.body.email == null || req.body.email == ' ';
        if(cond){
            res.json({ success: false, message: 'Please provide all required fields'});
        } else {
            user.save(function(err){
            if(err){
                res.json({success: false, message: 'Username or Email Already exist'});
                console.log(err);
            }else{
                    res.json({success: true, message: 'User Record Created Successfully'})
                }
            });

        }
        
    });
    return router;
}