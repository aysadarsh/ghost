const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    type: String,
    // langs: [mongoose.Schema.ObjectId],
    // genre: [mongoose.Schema.ObjectId],
    // routine: [mongoose.Schema.ObjectId],
    media: String,
    intro: Boolean,
    audio: String,
    title: String,
    name:String,
    artist: String,
    description: String,
    tags: String,
    // license: mongoose.Schema.ObjectId,
    // createdBy: mongoose.Schema.ObjectId,
    duration: Number,
    uid: String
  },
  { timestamps: true, collection: 'media' }
)

module.exports = mongoose.model('media', DBSchema)
