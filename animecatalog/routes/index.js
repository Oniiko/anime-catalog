var express = require('express');
var router = express.Router();

var Anime = require('../models/anime').Anime;
var Manga = require('../models/manga').Manga;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/anidb');
//var api_wrapper = require('../api_wrapper/get');
//api_wrapper.driver();
/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('homepage', { title: 'Anime DB', user: req.user });
});

router.get('/anime', function(req, res, next) {
	Anime.find({}, function(err, anime, count) {
		console.log(anime);
		res.render('index', {'list': anime, title: 'Anime', type: 'anime' });
	});
});

router.get('/anime/:slug', function(req, res, next) {
	Anime.findOne({slug: req.params.slug}, function(err, anime, count) {
		res.render('anime_entry', { anime: anime });
	});
});

router.get('/manga', function(req, res, next) {
	Manga.find({}, function(err, manga, count) {
		res.render('index', {'list': manga, title: 'Manga', type: 'manga' });
	});
});

router.get('/manga/:slug', function(req, res, next) {
	console.log(req.params.slug);
	Manga.findOne({slug: req.params.slug}, function(err, manga, count) {
		res.render('manga_entry', { manga: manga });
	});
});

module.exports = router;
