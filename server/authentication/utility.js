loggedIn = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/main/auth');
    }
}

module.exports.loggedIn = loggedIn;