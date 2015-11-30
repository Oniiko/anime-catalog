var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    URLSlugs = require('mongoose-url-slugs'),
    ObjectId = Schema.ObjectId;

var Manga_User_Rating = require('./manga_user_rating').Manga_User_Rating;

var Manga = new Schema();
Manga.add({
    id: ObjectId,
    title: String,
    image_url: String,
    type: String,
    aliases: [String],
    genres: [String],
    year: Number,
    tags: [String],
    status: String,
    chapter_count: Number,
    volume_count: Number,
    average_rating: Number,
    user_ratings: [Manga_User_Rating],
    synopsis: String,
    created_at: {type: Date},
    updated_at: {type: Date}
});

Manga.plugin(URLSlugs('title'));

Manga.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

var Manga = mongoose.model('Manga', Manga);
module.exports = {
    Manga: Manga
}