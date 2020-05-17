const config = module.exports

config.app = {
  domain: process.env.APP_DOMAIN,
  name: process.env.APP_NAME,
}

config.allowedOrigins = [
  `http://${config.app.domain}`,
  `https://${config.app.domain}`,
]

// TODO add blacklisted domains

config.env = process.env.NODE_ENV

// see https://zelark.github.io/nano-id-cc/
// before changing the link size
config.linkSize = {
  default: 6,
  min: 5,
  max: 10,
}

config.mongoUrl = process.env.MONGODB_URI

config.morgan = {
  format: 'dev',
}

config.port = process.env.PORT || 5000

if (config.env === 'production') {
  config.morgan.format = 'combined'
}
