
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref: 'brand'
    },
    brandZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brandZone'
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'state'
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'city'
    }
  },
  { timestamps: true, collection: 'stores' }
)

module.exports = mongoose.model('store', DBSchema)
