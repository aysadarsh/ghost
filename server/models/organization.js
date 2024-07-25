const mongoose = require('mongoose')
const { string } = require('zod')
const Schema = mongoose.Schema

const contactSchema = new Schema({
  mobile: { type: String },
  email: { type: String },
  designation: { type: String },
  name: { type: String }
})

const DBSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'industry'
    },
    registredAddress: {
      type: String
    },
    pincode: {
      type: String
    },
    contacts: [contactSchema],
    costType: {
      type: String,
      enum: ['Fixed', 'Perstore']
    },
    amount: {
      type: String
    },
    billingCycle: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Half-yearly', 'Yearly']
    },
    paymentMode: {
      type: String,
      enum: ['Prepaid', 'Postpaid', 'Others']
    },
    prepaidPer: {
      type: String,
    },
    postpaidPer: {
      type: String,
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
  { timestamps: true, collection: 'organizations' }
)

module.exports = mongoose.model('organization', DBSchema)
