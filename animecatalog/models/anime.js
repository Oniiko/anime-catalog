var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    URLSlugs = require('mongoose-url-slugs'),
    ObjectId = Schema.ObjectId,
    mongoosePaginate = require('mongoose-paginate');

//var Anime_Library_Entry = require('./anime_library_entry').Anime_Library_Entry;

var Anime = new Schema();
Anime.add({
    id: ObjectId,
    title: { type: String, required: true, unique: true},
    hummingbird_id: Number,
    hummingbird_rating: Number,
    image_url: String,
    type: { type: String, enum: ["TV", "Movie"], default: "Anime"},
    aliases: [String],
    genres: [String],
    started_airing: String,
    finished_airing: String,
    status: { type: String},
    episodes: Number,
    episode_length: Number,
    average_rating: {type: Number, default: 0},
    user_ratings: [{type: Schema.Types.ObjectId, ref: 'Anime_Library_Entry'}],
    synopsis: String,
    created_at: {type: Date},
    updated_at: {type: Date}
});

Anime.plugin(URLSlugs('title'));

Anime.plugin(mongoosePaginate);

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