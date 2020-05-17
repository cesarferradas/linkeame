const config = require('../config')

const code = {
  validator: (val) => (
    val.length >= config.linkSize.min && val.length <= config.linkSize.max
      && /^[a-z0-9]+$/i.test(val)
  ),
  message: () => (
    `Codigo corto debe tener entre ${config.linkSize.min} y ${config.linkSize.max} letras y/o numeros`
  ),
}

const url = {
  validator: (val) => /^https?:\/\/(www)?[^ "]+\.+[^ "]+$/.test(val),
  message: (props) => `'${props.value}' no es un enlace valido`,
}

module.exports = {
  code,
  url,
}
