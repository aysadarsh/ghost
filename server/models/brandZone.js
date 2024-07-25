
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brand'
    },
    
  },
  { timestamps: true, collection: 'brandZones' }
)

module.exports = mongoose.model('brandZone', DBSchema)
