var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    URLSlugs = require('mongoose-url-slugs'),
    ObjectId = Schema.ObjectId;

var Manga_User_Rating = require('./manga_user_rating').Manga_User_Rating;

var Manga = new Schema({
    id: ObjectId,
    title: String,
    aliases: [String],
    genre: [String],
    year: Number,
    tags: [String],
    status: String,
    average_rating: Number,
    user_ratings: [Manga_User_Rating],
    synopsis: String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Manga', Manga);