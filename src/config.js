const config = module.exports

config.app = {
  domain: process.env.APP_DOMAIN,
  name: process.env.APP_NAME,
}

config.blacklistedDomains = process.env.BLACKLISTED_DOMAINS
if (config.blacklistedDomains) {
  config.blacklistedDomains = config.blacklistedDomains.split(',')
} else {
  config.blacklistedDomains = []
}

config.corsOptions = {
  origin: '*',
  methods: 'GET',
  allowedHeaders: [
    'Accept',
    'Content-Type',
    'X-Csrf-Token',
  ],
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

config.phishtank = {
  appKey: process.env.PHISHTANK_APP_KEY,
  url: process.env.PHISHTANK_URL,
  username: process.env.PHISHTANK_USERNAME,
}

config.port = process.env.PORT || 3000

config.rateLimitOptions = {
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per windowMs
  message: {
    error: 'Demasiadas solicitudes, intenta de nuevo más tarde',
  },
}

if (config.env === 'production') {
  config.morgan.format = 'combined'
}
