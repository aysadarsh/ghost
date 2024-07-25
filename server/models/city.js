const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    state: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'state'
      }
  },
  { timestamps: true, collection: 'cities' }
)

module.exports = mongoose.model('city', DBSchema)
