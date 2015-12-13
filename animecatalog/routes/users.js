var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var User = require('../models/user').User;

var Anime_Library_Entry = require('../models/anime_library_entry').Anime_Library_Entry;
var Manga_Library_Entry = require('../models/manga_library_entry').Manga_Library_Entry;

/* GET users listing. */
router.get('/all', function(req, res, next) {
  	User.find({}, function(err, users, count) {
		    res.render('users/user_index', {'list': users, title: 'Users'});
	  });
});

//displays the signup page
router.get('/signup', isNotLoggedIn, function(req, res){
    res.render('users/signup');
});

router.post('/signup', function(req, res){
    User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('users/signup', { error: err });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

//displays the login page
router.get('/login', isNotLoggedIn, function(req, res){
    res.render('users/login');
});

//login request
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
    if (!user) { return res.render('users/login', { error: "Error: the user does not exist or password is wrong" }) }
    req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/anime');
    });
  })(req, res, next);
});

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', isLoggedIn, function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/:slug', function(req, res, next) {
    User.findOne({slug: req.params.slug}, function(err, user, count) {
        async.parallel({
            anime: function(callback){
               Anime_Library_Entry.find({user_id: user._id}, function(err, animes) {
                    callback(err, animes);
               });
            },
            manga: function(callback){
                Manga_Library_Entry.find({user_id: user._id}, function(err, mangas) {
                    callback(err, mangas);
                });
            }                 
        }, 
        function(err, result){
            var my_page = false;
            if (req.user == user) my_page = true;
            res.render('users/profile', { page_user: user, anime_library: result.anime, manga_library: result.manga, my_page: my_page});
        });
    });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log(req.user)
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next()

    // if they aren't redirect them to the home page
    res.redirect("/login")
}

function isNotLoggedIn(req, res, next) {
    if(req.user == null ) return next();
    else res.redirect('back');
}

module.exports = router;
