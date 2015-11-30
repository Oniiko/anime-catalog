var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	URLSlugs = require('mongoose-url-slugs'),
	ObjectId = Schema.ObjectId;

var Anime_User_Rating = require('./anime_user_rating').Anime_User_Rating;
var Manga_User_Rating = require('./manga_user_rating').Manga_User_Rating;

var User = new Schema();
User.{(
    id: ObjectId,
    username: String,
    password: String,
    anime_user_ratings: [Anime_User_Rating],
    manga_user_ratings: [Manga_User_Rating],
    anime_reviews_count: Number, //Cache counter
    manga_reviews_count: Number, //Cache counter
    created_at: Date,
    updated_at: Date
});

var User = mongoose.model('User', User);
module.exports = {
    User: User
}