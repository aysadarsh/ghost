const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mediaSchema = new Schema({name:String, media:String});

const DBSchema = new Schema(
  {
    // type: String,
    // langs: [mongoose.Schema.ObjectId],
    // genre: [mongoose.Schema.ObjectId],
    // routine: [mongoose.Schema.ObjectId],
    
    // intro: Boolean,
    media: [mediaSchema],
    // title: String,
    name:String,
    // artist: String,
    // description: String,
    // tags: String,
    // license: mongoose.Schema.ObjectId,
    // createdBy: mongoose.Schema.ObjectId,
    // duration: Number,
    // uid: String
  },
  { timestamps: true, collection: 'playlists' }
)

module.exports = mongoose.model('playlist', DBSchema)
