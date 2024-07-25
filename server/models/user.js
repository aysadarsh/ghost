const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const DBSchema = new Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store'
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
      }
    ]
  },
  { timestamps: true, collection: 'user' }
)

DBSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

module.exports = mongoose.model('user', DBSchema)
