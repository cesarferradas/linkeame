const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const config = require('../config')

const LinkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(config.linkSize.default),
    validate: {
      validator: (val) => val.length >= config.linkSize.min && val.length <= config.linkSize.max,
      message: () => `Codigo corto debe tener entre ${config.linkSize.min} y ${config.linkSize.max} caracteres`,
    },
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (val) => /^https?:\/\/(www)?[^ "]+\.+[^ "]+$/.test(val),
      message: (props) => `'${props.value}' no es un enlace valido`,
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
