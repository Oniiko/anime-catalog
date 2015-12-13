var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Manga = require('../models/manga').Manga;

var Manga_Library_Entry = new Schema();
Manga_Library_Entry.add({
    id: ObjectId,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    user_name: String,
    user_slug: String,
    manga_id: { type: Schema.Types.ObjectId, ref: 'Manga' },
    manga_info: {
        _id: false,
        title: { type: String },
        image_url: { type: String },
        slug: String,
        type: { type: String, enum: ['Manga', 'Oneshot'], default: 'Manga'},
        aliases: [String],
        genres: [String],
        year: Number,
        status: String,
        chapter_count: { type: Number, default: 0},
        volume_count: { type: Number, default: 0},
        synopsis: String
    },
    rating: Number,
    status: String,
    date_started: String,
    date_finished: String,
    chapters_read: Number,
    review: {
        text: String,
        created_at: Date,
        updated_at: Date
    },
    created_at: { type: Date },
    updated_at: { type: Date }
});

Manga_Library_Entry.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

var Manga_Library_Entry = mongoose.model('Manga_Library_Entry', Manga_Library_Entry);
module.exports = {
    Manga_Library_Entry: Manga_Library_Entry
}