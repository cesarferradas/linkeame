const config = module.exports

config.env = process.env.NODE_ENV

config.app = {
  domain: process.env.APP_DOMAIN,
  name: process.env.APP_NAME,
}

if (process.env.BLACKLISTED_DOMAINS) {
  config.blacklistedDomains = process.env.BLACKLISTED_DOMAINS.split(',')
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

config.cspOptions = {
  api: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  web: {
    directives: {
      defaultSrc: ["'self'", 'cdnjs.cloudflare.com'],
      imgSrc: ["'self'", 'data:'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'cdnjs.cloudflare.com'],
    },
  },
}

config.csrfOptions = {
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
  },
}

config.hstsOptions = {
  maxAge: 31536000,
  includeSubDomains: true,
}

// see https://zelark.github.io/nano-id-cc/
// before changing the link size or alphabet
config.link = {
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz_-',
  regex: /^[0-9A-Za-z_-]+$/i,
  size: {
    default: 6,
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
    error: 'Demasiadas solicitudes, intenta más tarde',
  },
}

config.referrerPolicy = {
  policy: 'no-referrer',
}

if (config.env === 'production') {
  config.morgan.format = 'combined'
}
