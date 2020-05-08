const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const config = require('../config')

const LinkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(config.linkSize),
  },
  domain: {
    type: String,
    enum: config.availableDomains,
    default: config.availableDomains[0],
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

LinkSchema.options.toJSON = {
  transform: (doc, ret) => ({
    domain: ret.domain,
    code: ret._id,
    url: ret.url,
    click_count: ret.clickCount,
    created_at: ret.createdAt,
  }),
}

const Link = mongoose.model('Link', LinkSchema)

module.exports = Link
