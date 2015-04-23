var passport = require('passport'), 
    FacebookStrategy = require('passport-facebook').Strategy, 
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy, 
    key = require('../api/api_key').google;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: key.clientID,
    clientSecret: key.clientSecret,
    callbackURL: "http://localhost:3456/main/auth/success"

  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

module.exports = passport;
