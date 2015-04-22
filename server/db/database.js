var Firebase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");
var secret = require("../api/api_key").firebase;

var tokenGenerator = new FirebaseTokenGenerator(secret.secret);
var token = tokenGenerator.createToken(
    {uid: "custom:1"});


var ref = new Firebase("https://roadtrip-advisor.firebaseio.com");
ref.authWithCustomToken(token, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!", authData);
  }
});

module.exports = ref;