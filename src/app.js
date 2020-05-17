const path = require('path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const csrf = require('csurf')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const morgan = require('morgan')

const config = require('./config')
const Link = require('./models/link')

const app = express()

app.locals.websiteName = config.app.name
app.locals.websiteDomain = config.app.domain

mongoose.connect(config.mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 5000,
}).catch((err) => console.error(`Could not connect to MongoDB ${err}`))

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({ credentials: true, origin: config.allowedOrigins }))
app.use(csrf({ cookie: true }))
app.use(helmet())
app.use(morgan(config.morgan.format))

// Template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))

// Routes
app.route('/')
  .get((req, res) => {
    res.render('index', { csrfToken: req.csrfToken() })
  })

  .post((req, res) => {
    const newLink = new Link(req.body)
    if (req.body.code) {
      newLink._id = req.body.code
    }
    newLink.save((err, link) => {
      if (err) {
        const msg = err.errors && (err.errors.url || err.errors._id || 'No se pudo acortar')
        res.render('index', {
          csrfToken: req.csrfToken(),
          msg,
        })
      } else {
        res.redirect(`/link/${link.id}?s=1`)
      }
    })
  })

app.route('/link/:linkId')
  .get((req, res) => {
    Link.findById(req.params.linkId, (err, link) => {
      if (err || !link) {
        console.error(err)
        res.render('error', { msg: 'Enlace no existe' })
      } else {
        res.render('link', {
          longUrl: link.url,
          shortUrl: `${config.app.domain}/${link._id}`,
          clickCount: link.clickCount,
          success: req.query.s,
        })
      }
    })
  })

app.route('/:linkId')
  .get((req, res) => {
    Link.findById(req.params.linkId, (err, link) => {
      if (err || !link) {
        console.error(err)
        res.render('error', { msg: 'Enlace no existe' })
      } else {
        link.clickCount += 1
        link.save()
        res.redirect(link.url)
      }
    })
  })

app.route('*')
  .all((req, res) => {
    res.render('error', { msg: 'No encontrado' })
  })

module.exports = app
