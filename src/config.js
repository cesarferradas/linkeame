const config = module.exports

config.app = {
  domain: process.env.APP_DOMAIN,
  name: process.env.APP_NAME,
}

config.allowedOrigins = [
  'http://localhost:3000',
]

config.env = process.env.NODE_ENV

config.jwt = {
  secret: process.env.JWT_SECRET,
  issuer: config.app.domain,
  expires: '24h',
}

config.cookies = {
  maxAge: 1000 * 60 * 60 * 24,
  secure: false,
}

// see https://zelark.github.io/nano-id-cc/
// before changing the link size
config.linkSize = 7

config.mongoUrl = process.env.MONGODB_URI

config.morgan = {
  format: 'tiny',
}

config.port = process.env.PORT || 5000

config.saltRounds = 10

config.winston = {
  level: 'debug',
}

if (config.env === 'production') {
  config.morgan.format = 'combined'
  config.winston.level = 'info'

  config.cookies.domain = `*.${config.app.domain}`
  config.cookies.sameSite = 'lax'
  config.cookies.secure = true

  config.allowedOrigins = [
    `http://${config.app.domain}`,
    `https://${config.app.domain}`,
  ]
}
