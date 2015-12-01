var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user').User;

/* GET users listing. */
router.get('/users', function(req, res, next) {
  	User.find({}, function(err, users, count) {
		    res.render('index', {'list': users, title: 'Users'});
	  });
});

//displays the signup page
router.get('/signup', function(req, res){
    res.render('../views/users/signup');
});

router.post('/signup', function(req, res){
    User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('../views/users/signup', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

//displays the login page
router.get('/login', function(req, res){
    res.render('../views/users/login');
});

//login request
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
/**
module.exports = function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) return next();

    res.redirect('/');
}
**/


module.exports = router;
