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
  validator: (val) => /^http?:\/\/(www)?[^ "]+\.+[^ "]+$/.test(val),
  message: (props) => `El formato de '${props.value}' no es válido`,
}

module.exports = {
  code,
  url,
}
