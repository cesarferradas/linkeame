const config = require('../config')

const code = {
  validator: (val) => (
    val.length >= config.linkSize.min && val.length <= config.linkSize.max
      && /^[a-zA-Z0-9_-]+$/i.test(val)
  ),
  message: () => (
    `Codigo personalizado debe tener entre ${config.linkSize.min} y ${config.linkSize.max} letras y/o numeros`
  ),
}

const url = {
  validator: (val) => val.includes('http') && val.includes('/') && val.includes('.'),
  message: (props) => `El formato de '${props.value}' no es válido`,
}

module.exports = {
  code,
  url,
}
