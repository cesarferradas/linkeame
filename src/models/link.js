const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const config = require('../config')

const LinkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(config.linkSize),
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (val) => /^https?:\/\/(www)?[^ "]+\.+[^ "]+$/.test(val),
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true })

const Link = mongoose.model('Link', LinkSchema)

module.exports = Link
