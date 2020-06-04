const config = require('../config')

const code = {
  validator: (val) => (
    val.length >= config.link.size.min && val.length <= config.link.size.max
      && config.link.regex.test(val)
  ),
  message: () => (
    `El código debe tener entre ${config.link.size.min} y ${config.link.size.max} letras, números y guiones`
  ),
}

const url = {
  validator: (val) => (
    /^https?:\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]/i.test(val)
    || /^mailto:[a-zA-Z0-9.+]+@[a-z0-9]+\.[a-z]+$/i.test(val)
  ),
  message: () => 'El formato del enlace largo no es válido',
}

module.exports = {
  code,
  url,
}
