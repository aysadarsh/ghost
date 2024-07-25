
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'organization'
    },
    storeCount: {
      type: String
    },
    brief: {
      type: String
    },
    contractType: {
      type: String,
      enum: ['Demo', 'Live']
    },
    contractDocument: {
      type: String,
    },
    contractStartDate: {
      type: Date,
      default:Date.now()
    },
    contractEndDate: {
      type: Date,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'state'
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'city'
    },
    autoCreateStores:{
      type:Boolean,
      default:0
    }
  },
  { timestamps: true, collection: 'brands' }
)

module.exports = mongoose.model('brand', DBSchema)
