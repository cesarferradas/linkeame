const path = require('path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const csrf = require('csurf')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const morgan = require('morgan')
const qrcode = require('qrcode')
const urlParser = require('url-parse')

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

// Views and static files
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))
app.use(express.static(path.join(__dirname, './public')))

// Routes
app.route('/')
  .get((req, res) => {
    res.render('index', {
      csrfToken: req.csrfToken(),
      ...captcha.generateChallenge(),
    })
  })

  .post((req, res) => {
    const errorData = {
      csrfToken: req.csrfToken(),
      ...captcha.generateChallenge(),
      ...req.body,
    }

    if (captcha.getChallenge(req.body._numbers) !== req.body.challenge) {
      res.render('index', {
        error: 'Verificación incorrecta',
        ...errorData,
      })
    }

    const code = req.body.code.trim()
    let url = req.body.url.trim()
    const parsedUrl = urlParser(url)

    if (config.blacklistedDomains.includes(parsedUrl.hostname)) {
      res.render('index', {
        error: 'El dominio del enlace original no está permitido',
        ...errorData,
      })
    } else {
      if (!parsedUrl.protocol) url = `http://${url}`

      const newLink = new Link({ url })
      if (code) newLink._id = code

      newLink.save((err, link) => {
        if (err) {
          const error = (err.errors && (err.errors.url || err.errors._id))
            || (err.errmsg && err.errmsg.includes('duplicate') && 'El código personalizado no está disponible')
            || 'No se pudo acortar el enlace, por favor intenta de nuevo'
          console.error(error)

          res.render('index', { error, ...errorData })
        } else {
          res.redirect(`/link/${link.id}`)
        }
      })
    }
  })

app.route('/l*/:linkId')
  .get((req, res) => {
    Link.findById(req.params.linkId, (err, link) => {
      if (err) {
        console.error(err)
      } else if (!link) {
        res.status(404).render('error')
      } else {
        const data = {
          adminUrl: `${config.app.domain}/link/${link._id}`,
          clickCount: link.clickCount,
          longUrl: link.url,
          pageTitle: link._id,
          shortUrl: `${config.app.domain}/${link._id}`,
          shortUrlFull: `http://${config.app.domain}/${link._id}`,
          success: !link.clickCount && '¡Enlace acortado! Guarda esta página para volver a ver los siguientes detalles',
        }
        qrcode.toDataURL(data.shortUrlFull, { width: 200 })
          .then((qrData) => {
            res.render('link', { qrData, ...data })
          })
          .catch((qrError) => {
            console.error(qrError)
            res.render('link', data)
          })
      }
    })
  })

app.route('/apoyo')
  .get((req, res) => res.render('support'))

app.route('/faq')
  .get((req, res) => res.render('faq'))

app.route('/privacidad')
  .get((req, res) => res.render('privacy'))

app.route('/terminos')
  .get((req, res) => res.render('terms'))

app.route(['/:linkId', '//:linkId'])
  .get((req, res) => {
    Link.findById(req.params.linkId, (err, link) => {
      if (err) {
        console.error(err)
      } else if (!link) {
        res.status(404).render('error')
      } else {
        link.clickCount += 1
        link.save()
        res.redirect(link.url)
      }
    })
  })

app.route('*')
  .get((req, res) => {
    res.status(404).render('error')
  })

module.exports = app
