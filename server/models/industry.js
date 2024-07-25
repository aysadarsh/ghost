const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true, collection: 'industries' }
)

module.exports = mongoose.model('industry', DBSchema)