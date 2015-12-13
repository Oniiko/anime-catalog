var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Anime = require('../models/anime').Anime;

var Anime_Library_Entry = new Schema();
Anime_Library_Entry.add({
    id: ObjectId,
    user_id: { type: ObjectId, ref: 'User'},
    user_name: String,
    user_slug: String,
    anime_id: { type: Schema.Types.ObjectId, ref: 'Anime' },
    anime_info: { 
        _id: false,
        title: { type: String },
        image_url: String,
        slug: String,
        type: { type: String, enum: ["TV", "Movie"]},
        aliases: [String],
        genres: [String],
        started_airing: String,
        finished_airing: String,
        status: { type: String},
        episodes: Number,
        episode_length: Number,
        synopsis: String
    },
    rating: Number,
    status: String,
    date_started: String,
    date_finished: String,
    episodes_seen: Number,
    review: {
        text: String,
        created_at: Date,
        updated_at: Date
    },
    created_at: {type: Date},
    updated_at: {type: Date}
});

Anime_Library_Entry.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

var Anime_Library_Entry = mongoose.model('Anime_Library_Entry', Anime_Library_Entry);
module.exports = {
    Anime_Library_Entry: Anime_Library_Entry
}