const path = require('path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const morgan = require('morgan')

const config = require('./config')
const api = require('./routes/api')
const web = require('./routes/web')

const app = express()

app.set('trust proxy', true)
app.locals.config = config

// Database
mongoose.connect(config.mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 5000,
}).catch((err) => console.error(`Could not connect to MongoDB ${err}`))

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf(config.csrfOptions))
app.use(helmet())
app.use(helmet.referrerPolicy(config.referrerPolicy))
app.use(helmet.hsts(config.hstsOptions))
app.use(morgan(config.morgan.format))

// Views and static files
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))
app.use(express.static(path.join(__dirname, './public')))

// Routes
app.use('/api', api)
app.use('/', web)

module.exports = app
