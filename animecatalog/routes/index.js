var express = require('express');
var router = express.Router();
var async = require('async');
var validator = require('validator');

var Anime = require('../models/anime').Anime;
var Manga = require('../models/manga').Manga;
var User = require('../models/user').User;
var Anime_Library_Entry = require('../models/anime_library_entry').Anime_Library_Entry;
var Manga_Library_Entry = require('../models/manga_library_entry').Manga_Library_Entry;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/anidb');

//var api_wrapper = require('../api_wrapper/get');
//api_wrapper.driver();
//var user_data = require('../api_wrapper/get_user_data');
//user_data.driver();
//var collaborative_filtering = require('../recommender/collaborative_filtering');

router.get('/', function(req, res, next) {
  	res.redirect('/anime');
});

/**
router.get('/recommendations', function(req, res, next) {
    var query = req.query;
    if (query["user"] != null) {
        collaborative_filtering.getRatingData(function(data) { 
            var n = 5;
            if (query["n"] != null) n = query["n"];
            user = query["user"];
            var sim_func = 2;
            if (query["sim_func"] != null) sim_func = query["sim_func"];
            if (sim_func == 1) {
                var matches = collaborative_filtering.top_matches(data, user, n, collaborative_filtering.distance_similarity);
                var recomms = collaborative_filtering.recommend(data, user, n, collaborative_filtering.distance_similarity);
                res.render('recommendations', { title: 'Recommendations', username:  user, n: n, sim_func: sim_func, matches: matches,  recomms: recomms});
            } else {
                var matches = collaborative_filtering.top_matches(data, user, n, collaborative_filtering.pearson_similarity);
                var recomms = collaborative_filtering.recommend(data, user, n, collaborative_filtering.pearson_similarity);
                res.render('recommendations', { title: 'Recommendations', username:  user, n: n, sim_func: sim_func, matches: matches,  recomms: recomms});
            }
        });
    }
    else {
        res.render('recommendations', { title: 'Recommendations'});
    }
    
});
**/

router.get('/anime', function(req, res, next) {
    //if (typeof Anime.paginate === "function") console.log("Anime.paginate is existed");
    //else console.log("Anime.paginate is not existed");
	/**Anime.paginate({}, {page: req.query.page, limit: req.query.limit}, function(err, anime, pageCount, count) {
        console.log("called into Anime.paginate");
		//res.render('index', {'list': anime, title: 'Anime', type: 'anime' });
        if (err) return next(err);

        res.format({
            html: function() {
                res.render('users', {
                    users: users,
                    pageCount: pageCount,
                    itemCount: count,
                    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                });
            },
            json: function() {
                res.json({
                    object: 'list',
                    has_more: paginate.hasNextPages(req)(pageCount),
                    data: anime
                });
            }
        });
	});
    **/
    Anime.find({}).sort({hummingbird_rating: 'desc'}).exec(function(err, anime, count) {
        res.render('index', {'list': anime, title: 'Anime', type: 'anime' });
    });
});

router.get('/anime/:slug', function(req, res, next) {
    Anime.findOne({slug: req.params.slug}, function(err, anime, count) {
        async.parallel({
            my_user_rating: function(callback){
                if (req.user != null) {
                    Anime_Library_Entry.findOne({anime_id: anime._id, user_id: req.user._id }, function(err, user_rating) {
                        callback(err, user_rating);
                    });
                }
                else {
                    callback(err);
                }
            },
            reviews: function(callback){
                Anime_Library_Entry.find({anime_id: anime._id, review: { $ne: null }}, function(err, reviews, count) {
                    //console.log(reviews);
                    callback(err, reviews);
                });
            }               
        }, 
        function(err, result){
            console.log(result.reviews);
            res.render('anime_entry', { anime: anime, user_rating: result.my_user_rating, reviews: result.reviews });
        });
    });
});



router.post('/anime_library_entry/create', function(req, res, next) {
    console.log(req.user);
    var errmsg = validateAnimeEntryForm(req.body, req.user.username);
    if (errmsg != null) {
        //res.json({errmsg: errmsg});
        res.redirect('back');
        return;    
    }
    var id = mongoose.Types.ObjectId(req.body.anime_id);
	var anime_info = Anime.findOne({_id: id }, function(err, anime) {
        save_anime_library_entry(req, res, anime);
    });
});

router.post('/anime_library_entry/update', function(req, res, next) {
    var errmsg = validateAnimeEntryForm(req.body, req.user.username);
    if (errmsg != null) {
        res.json({errmsg: errmsg});
        return;    
    }
    Anime_Library_Entry.findOne({user_id: req.user._id, anime_id: req.body.anime_id}, function(err, lib_entry, count) {
        lib_entry.rating = req.body.rating;
        lib_entry.episodes_seen = req.body.episodes_seen;
        lib_entry.status = req.body.status;
        lib_entry.date_started = req.body.date_started;
        lib_entry.date_finished = req.body.date_finished;
        lib_entry.review.text = req.body.review;
        lib_entry.save(function(err){
            console.log("get here");
            res.json(lib_entry);
        });
    });
});

router.get('/manga', function(req, res, next) {
	Manga.find({}).sort({hummingbird_rating: 'desc'}).exec(function(err, manga, count) {
		res.render('index', {'list': manga, title: 'Manga', type: 'manga' });
	});
});

router.get('/manga/:slug', function(req, res, next) {
	Manga.findOne({slug: req.params.slug}, function(err, manga, count) {
        async.parallel({
            my_user_rating: function(callback){
                if (req.user != null) {
                    Manga_Library_Entry.findOne({manga_id: manga._id, user_id: req.user._id }, function(err, user_rating) {
                        callback(err, user_rating);
                    });
                }
                else {
                    callback(err);
                }
            },
            reviews: function(callback){
                Manga_Library_Entry.find({manga_id: manga._id, review: { $ne: null }}, function(err, reviews, count) {
                    callback(err, reviews);
                });
            }               
        }, 
        function(err, result){
            res.render('manga_entry', { manga: manga, user_rating: result.my_user_rating, reviews: result.reviews });
        });
	});
});

router.post('/manga_library_entry/create', function(req, res, next) {
    var errmsg = validateMangaEntryForm(req.body, req.user.username);
    if (errmsg != null) {
        //res.json({errmsg: errmsg});
        res.redirect('back');
        return;    
    }
	var id = mongoose.Types.ObjectId(req.body.manga_id);
    var manga_info;
    Manga.findOne({_id: id }, function(err, manga) {
        manga_info = manga;
        //console.log("Returned object: " +  manga);
        save_manga_library_entry(req, res, manga);
    });

});

router.post('/manga_library_entry/update', function(req, res, next) {
    var errmsg = validateMangaEntryForm(req.body, req.user.username);
    if (errmsg != null) {
        res.json({errmsg: errmsg});
        return;    
    }
    Manga_Library_Entry.findOne({user_id: req.user._id, manga_id: req.body.manga_id}, function(err, lib_entry, count) {
        lib_entry.rating = req.body.rating;
        lib_entry.chapters_read = req.body.chapters_read;
        lib_entry.status = req.body.status;
        lib_entry.date_started = req.body.date_started;
        lib_entry.date_finished = req.body.date_finished;
        lib_entry.review.text = req.body.review;
        lib_entry.save(function(err){
            //console.log(req.body.manga_info.average_rating);
            //var response = { average_rating: req.body.manga_info.average_rating };
            //response.entry = lib_entry;
            res.json(lib_entry);
            /**
            Manga.findOneAndUpdate({_id: lib_entry.manga_id}, function(err, manga, count) {
                if(manga == null) res.redirect('back');
                manga.average_rating += (lib_entry.rating - manga.average_rating)/(manga.user_ratings.length + 1);
                manga.save(function(err) {
                    console.log('error ' + err);
                    res.redirect('back');
                });
            });
            **/
        });
    });
});

/** Helper Functions **/

//Remember to refactor this and anime entry form together
function validateMangaEntryForm(reqbody, requser) {
    var manga_id = reqbody.manga_id;
    var user = reqbody.user;
    if (user == null || user == "") {
        return "You have to be logged in to add to library";
    }

    var chapter_count = reqbody.chapter_count;
    if (manga_id == null) {
        return "Error: manga_id is null";
    }
    var rating = reqbody.rating;
    if (rating != null && rating != "") {
        if (!IsNumeric(rating)) {
            return "Error: rating is not number";
        }
        if (rating<0.0 || rating > 5.0) {
            return "Server-side Error: rating must between 0 and 5";
        }
    }

    var chapters_read = Number(reqbody.chapters_read);
    if (chapters_read != null && chapters_read != "") {
        if (!IsNumeric(chapters_read)) {
            return "Error: chapters_read is not number";
        }
        if ((chapters_read > chapter_count) || (0 > chapters_read)) {
            return "Error: chapters_read must between 0 and " + chapter_count;
        }
    }
    var has_both = 0;
    var date_started = reqbody.date_started;
    if (date_started != null && date_started !="") {
        if (!isDate(date_started)) {
            return "Error: date started is not in a yyyy-mm-dd date format";
        }
        has_both++;
    }
    var date_finished = reqbody.date_finished;
    if (date_finished != null && date_finished !="") {
        if (!isDate(date_finished)) {
            return "Error: date finished is not a yyyy-mm-dd date format";
        }
        has_both++;
    }
    if (has_both ==2) {
        if (date_started > date_finished) {
            return "Error: the date finished can't be before date started";
        }

    }
    
    var status = reqbody.status;
    var status_enum = ["Plan to watch", "Watching", "Completed", "On-hold", "Dropped"];
    /*
    if (!(status_enum.includes(status))) {
        return "Error: invalid status type";
    }*/
    return null;
}

//Helper function saves manga library entries
function save_manga_library_entry (req, res, manga_info) {
    var new_lib_entry = new Manga_Library_Entry({
        user_id: req.user._id,
        user_name: req.user.username,
        user_slug: req.user.slug,
        manga_id: req.body.manga_id,
        manga_info: {
            title: manga_info.title,
            image_url: manga_info.image_url,
            slug: manga_info.slug,
            type: manga_info.type,
            aliases: manga_info.aliases,
            genres: manga_info.genres,
            year: manga_info.year,
            status: manga_info.status,
            chapter_count: manga_info.chapter_count,
            volume_count: manga_info.volume_count,
            synopsis: manga_info.synopsis
        },
        review: {
            text: req.body.review
        },
        rating: req.body.rating,
        status: req.body.status,
        date_started: req.body.date_started,
        date_finished: req.body.date_finished,
        chapters_read: req.body.chapters_read
    });
    new_lib_entry.save(function(err){
        console.log(new_lib_entry);
        if (err) {
            console.log('error ' + err);
        }
        else {
            Manga.findOneAndUpdate({_id: new_lib_entry.manga_id}, {$push: {user_ratings: new_lib_entry}}, function(err, manga, count) {

                manga.average_rating = (new_lib_entry.rating + manga.average_rating*manga.user_ratings.length)/(manga.user_ratings.length + 1);
                manga.average_rating = (Math.round(manga.average_rating * 100) / 100)
                manga.save(function(err) {
                    console.log('error ' + err);
                });
            });
            User.findOneAndUpdate({_id: new_lib_entry.user_id}, {$push: {manga_library: new_lib_entry}}, function() {});
        }
        //res.json(new_lib);
        res.redirect('back');
    });
};

function validateAnimeEntryForm(reqbody, requser) {
    var anime_id = reqbody.anime_id;
    var user = reqbody.user;
    if (user == null || user == "") {
        return "You have to be logged in to add to library";
    }
    console.log("user = " + user);
    console.log("requser = " + requser);
    if (user != requser) {
        return "Not authorized to make change";
    }

    var episodes = reqbody.episodes;
    if (anime_id == null) {
        return "Error: anime_id is null";
    }
    var rating = reqbody.rating;
    if (rating != null && rating != "") {
        if (!IsNumeric(rating)) {
            return "Error: rating is not number";
        }
        if (rating<0.0 || rating > 5.0) {
            return "Server-side Error: rating must between 0 and 5";
        }
    }

    var episodes_seen = reqbody.episodes_seen;
    if (episodes_seen != null && episodes_seen != "") {
        if (!IsNumeric(episodes_seen)) {
            return "Error: episodes_seen is not number";
        }
        if ((episodes_seen > episodes) || (0 > episodes_seen)) {
            return "Error: episodes_seen must between 0 and " + episodes;
        }
    }
    var has_both = 0;
    var date_started = reqbody.date_started;
    if (date_started != null && date_started !="") {
        if (!isDate(date_started)) {
            return "Error: date started is not in a yyyy-mm-dd date format";
        }
        has_both++;
    }
    var date_finished = reqbody.date_finished;
    if (date_finished != null && date_finished !="") {
        if (!isDate(date_finished)) {
            return "Error: date finished is not a yyyy-mm-dd date format";
        }
        has_both++;
    }
    if (has_both ==2) {
        if (date_started > date_finished) {
            return "Error: the date finished can't be before date started";
        }

    }
    var status = reqbody.status;
    var status_enum = ["Plan to watch", "Watching", "Completed", "On-hold", "Dropped"];
    /*
    if (!(status_enum.includes(status))) {
        return "Error: invalid status type";
    }*/
    return null;
}

function save_anime_library_entry (req, res, anime_info) {
    var new_lib_entry = new Anime_Library_Entry({
        user_id: req.user._id,
        user_name: req.user.username,
        user_slug: req.user.slug,
        anime_id: req.body.anime_id,
        anime_info: {
            title: anime_info.title,
            image_url: anime_info.image_url,
            slug: anime_info.slug,
            type: anime_info.type,
            aliases: anime_info.aliases,
            genres: anime_info.genres,
            started_airing: anime_info.started_airing,
            finished_airing: anime_info.finished_airing,
            status: anime_info.status,
            episodes: anime_info.episodes,
            episode_length: anime_info.episode_length,
            synopsis: anime_info.synopsis,
        },
        review: {
            text: req.body.review
        },
        rating: req.body.rating,
        status: req.body.status,
        date_started: req.body.date_started,
        date_finished: req.body.date_finished,
        episodes_seen: req.body.episodes_seen
    });
    new_lib_entry.save(function(err){
        console.log(new_lib_entry);
        if (err) {
            console.log('error ' + err);
        }
        else {
            Anime.findOneAndUpdate({_id: new_lib_entry.anime_id}, {$push: {user_ratings: new_lib_entry}}, function(err, anime, count) {
                anime.average_rating += (new_lib_entry.rating - anime.average_rating)/(anime.user_ratings.length + 1);
                anime.save(function(err) {
                    console.log('error ' + err);
                });
            });
            User.findOneAndUpdate({_id: new_lib_entry.user_id}, {$push: {anime_library: new_lib_entry}}, function() {});
        }
        res.redirect('back');
    });
}

function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
}

function isDate(input){
    var RE = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
    return input.match(RE);
}

module.exports = router;
