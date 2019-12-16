const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user.model');
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback : true
}, function(req, email, password, done) {
  process.nextTick(function(){
    User.findOne({'email' : email}, function(err, user) {
      if(err) return done(err);
      if(!user) return done(null, false, req.flash('errors', "No User"));
      if(!user.validatePassword(password)){
        return done(null, false, req.flash('errors', "Invalid Credentials"));
      }
      return done(null, user);
    });
  });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});