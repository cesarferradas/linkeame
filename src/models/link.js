const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const validation = require('../utils/validation')
const config = require('../config')

const LinkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(config.linkSize.default),
    validate: validation.code,
  },
  url: {
    type: String,
    required: true,
    validate: validation.url,
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
