
var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('../models/user.js');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = 'Samz851';

module.exports= function( app, passport){

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false }}));

    passport.serializeUser(function(user, done) {
        token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
        done(null, user.id, token);
    });
      
      passport.deserializeUser(function(id, done) {
          console.log("this is the id in deserialize: " + id);
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: "145944316075034", //FACEBOOK_APP_ID,
        clientSecret: "1f62e22d63205c1da670370708eedffa", //FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
          console.log("this is the email got it from fb: " + profile._json.email);
          User.findOne({email: profile._json.email}).select('username password email').exec(function(err, user){
              if(err) done(err);
              if(user && user != null) {
                  done(null, user);
              } else {
                  done(err);
              }
          })

      }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror'}), function(req, res){
        res.redirect('/facebook/' + token);
    }); //successRedirect: '/about',  but we'll redirect in front-end
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    return passport;

}