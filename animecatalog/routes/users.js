var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  	User.find({}, function(err, users, count) {
		res.render('index', {'list': users, title: 'Users'});
	});
});

module.exports = router;
