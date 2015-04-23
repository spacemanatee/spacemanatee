var loggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect('/main/auth');
  }
};

var isLoggedIn = function(req, res, next) {
  res.set('loggedIn', req.isAuthenticated());
  next();
};

module.exports.loggedIn = loggedIn;
module.exports.isLoggedIn = isLoggedIn;