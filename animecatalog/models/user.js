var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	URLSlugs = require('mongoose-url-slugs'),
	ObjectId = Schema.ObjectId;

var User = new Schema({
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

module.exports = mongoose.model('User', User);