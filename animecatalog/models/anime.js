var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    URLSlugs = require('mongoose-url-slugs'),
    ObjectId = Schema.ObjectId;

var Anime_User_Rating = require('./anime_user_rating').Anime_User_Rating;

var Anime = new Schema();
Anime.add({
    id: ObjectId,
    title: String,
    image_url: String,
    type: String,
    aliases: [String],
    genres: [String],
    started_airing: String,
    finished_airing: String,
    tags: [String],
    status: String,
    episodes: Number,
    episode_length: Number,
    average_rating: Number,
    user_ratings: [Anime_User_Rating],
    synopsis: String,
    created_at: {type: Date},
    updated_at: {type: Date}
});

Anime.plugin(URLSlugs('title'));

Anime.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

var Anime = mongoose.model('Anime', Anime);
module.exports = {
    Anime: Anime
}