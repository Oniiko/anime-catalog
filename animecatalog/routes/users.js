var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  	User.find({}, function(err, users, count) {
		res.render('index', {'list': users, title: 'Users'});
	});
});

//displays the signup page
router.get('/signup', function(req, res){
  res.render('signup');
});

//displays the login page
router.get('/login', function(req, res){
  res.render('login');
});

//displays our signup page
router.get('/signup', function(req, res){
  res.render('signup');
});

//login request
router.post('/login', function(req, res) { 

});

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});



module.exports = router;
