const config = module.exports

config.app = {
  domain: process.env.APP_DOMAIN,
  name: process.env.APP_NAME,
}

config.allowedOrigins = [
  `http://${config.app.domain}`,
  `https://${config.app.domain}`,
]

config.blacklistedDomains = process.env.BLACKLISTED_DOMAINS
if (config.blacklistedDomains) {
  config.blacklistedDomains = config.blacklistedDomains.split(',')
} else {
  config.blacklistedDomains = []
}

config.env = process.env.NODE_ENV

// see https://zelark.github.io/nano-id-cc/
// before changing the link size or alphabet
config.link = {
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
  regex: /^[0-9A-Za-z_-]+$/i,
  size: {
    default: 7,
    min: 5,
    max: 30,
  },
}

config.mongoUrl = process.env.MONGODB_URI

config.morgan = {
  format: 'dev',
}

config.port = process.env.PORT || 3000

if (config.env === 'production') {
  config.morgan.format = 'combined'
}
