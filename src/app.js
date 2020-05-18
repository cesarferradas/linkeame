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
const captcha = require('./utils/captcha')
const Link = require('./models/link')

const app = express()

app.locals.websiteName = config.app.name
app.locals.websiteDomain = config.app.domain

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
app.use(cors({ credentials: true, origin: config.allowedOrigins }))
app.use(csrf({ cookie: true }))
app.use(helmet())
app.use(morgan(config.morgan.format))

// Template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))
app.use(express.static(path.join(__dirname, './public')))

// Routes
app.route('/')
  .get((req, res) => {
    res.render('index', {
      ...captcha.generateChallenge(),
      csrfToken: req.csrfToken(),
    })
  })

  .post((req, res) => {
    if (captcha.getChallenge(req.body._numbers) !== req.body.challenge) {
      res.render('index', {
        ...req.body,
        ...captcha.generateChallenge(),
        csrfToken: req.csrfToken(),
        msg: 'Verificación incorrecta',
      })
    } else {
      let { url } = req.body
      if (!url.includes('http')) url = `http://${url}`

      const newLink = new Link({ url })
      if (req.body.code) newLink._id = req.body.code

      newLink.save((err, link) => {
        if (err) {
          const msg = err.errors && (err.errors.url || err.errors._id || 'No se pudo acortar')
          res.render('index', {
            ...req.body,
            ...captcha.generateChallenge(),
            csrfToken: req.csrfToken(),
            msg,
          })
        } else {
          res.redirect(`/link/${link.id}`)
        }
      })
    }
  })

app.route('/contacto')
  .get((req, res) => {
    res.render('contact', { pageTitle: 'contacto' })
  })

app.route('/privacidad')
  .get((req, res) => {
    res.render('privacy', { pageTitle: 'privacidad' })
  })

app.route('/link/:linkId')
  .get((req, res) => {
    Link.findById(req.params.linkId, (err, link) => {
      if (err || !link) {
        console.error(err)
        res.render('error', { msg: 'El URL ingresado no existe' })
      } else {
        res.render('link', {
          pageTitle: link._id,
          longUrl: link.url,
          shortUrl: `${config.app.domain}/${link._id}`,
          clickCount: link.clickCount,
        })
      }
    })
  })

app.route('/:linkId')
  .get((req, res) => {
    Link.findById(req.params.linkId, (err, link) => {
      if (err || !link) {
        console.error(err)
        res.render('error', { msg: 'El URL ingresado no existe' })
      } else {
        link.clickCount += 1
        link.save()
        res.redirect(link.url)
      }
    })
  })

module.exports = app
