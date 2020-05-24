const config = require('../config')

const code = {
  validator: (val) => (
    val.length >= config.linkSize.min && val.length <= config.linkSize.max
      && /^[a-zA-Z0-9_-]+$/i.test(val)
  ),
  message: () => (
    `El código debe tener entre ${config.linkSize.min} y ${config.linkSize.max} letras (sin tilde) y/o números`
  ),
}

const url = {
  validator: (val) => /^https?:\/\/[a-zA-Z0-9]+.[a-zA-Z0-9]/i.test(val),
  message: () => 'El formato del enlace largo no es válido',
}

module.exports = {
  code,
  url,
}
