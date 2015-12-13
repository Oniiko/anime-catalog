var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    URLSlugs = require('mongoose-url-slugs'),
    ObjectId = Schema.ObjectId,
    mongoosePaginate = require('mongoose-paginate');

var Manga_Library_Entry = require('./manga_library_entry').Manga_Library_Entry;

var Manga = new Schema();
Manga.add({
    id: ObjectId,
    title: { type: String, required: true},
    hummingbird_id: Number,
    hummingbird_rating: Number,
    image_url: { type: String },
    type: { type: String, enum: ['Manga', 'Oneshot'], default: 'Manga'},
    aliases: [String],
    genres: [String],
    year: Number,
    status: String,
    chapter_count: { type: Number, default: 0},
    volume_count: { type: Number, default: 0},
    average_rating: { type: Number, default: 0},
    user_ratings: [ {type: Schema.Types.ObjectId, ref: 'Manga_Library_Entry'}],
    synopsis: String,
    created_at: {type: Date},
    updated_at: {type: Date}
});

Manga.plugin(URLSlugs('title'));

Manga.plugin(mongoosePaginate);

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