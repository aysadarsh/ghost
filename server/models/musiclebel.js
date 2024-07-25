const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    licence: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'licence'
      }
  },
  { timestamps: true, collection: 'musicLabels' }
)

module.exports = mongoose.model('musicLabel', DBSchema)
