var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

if (!process.env.GOOGLE_ID) {
  var key = require('../api/api_key').google,
  var callbackCurrentURL = "http://localhost:3456/main/auth/success";
} else {
  var callbackCurrentURL = process.env.CALLBACK_URL;
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID || key.clientID,
    clientSecret: process.env.GOOGLE_SECRET || key.clientSecret,
    callbackURL: callbackCurrentURL;
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

module.exports = passport;
