const express = require('express')
const helmet = require('helmet')
const qrcode = require('qrcode')
const slugify = require('slugify')
const urlParser = require('url-parse')

const Link = require('../models/link')
const captcha = require('../utils/captcha')
const config = require('../config')

const web = express.Router()

web.use(helmet.contentSecurityPolicy(config.cspOptions.web))

web.route('/apoyo')
  .get((req, res) => res.render('support'))

web.route('/gracias')
  .get((req, res) => res.render('thanks'))

web.route('/faq')
  .get((req, res) => res.render('faq'))

web.route('/privacidad')
  .get((req, res) => res.render('privacy'))

web.route('/terminos')
  .get((req, res) => res.render('terms'))

web.route('/')
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
    } else {
      const code = slugify(req.body.code.trim())
      let url = req.body.url.trim()
      let parsedUrl = urlParser(url)

      if (!parsedUrl.protocol) {
        url = `http://${url}`
        parsedUrl = urlParser(url)
      }

      if (config.blacklistedDomains.includes(parsedUrl.hostname)) {
        res.render('index', {
          error: 'El dominio del enlace original no está permitido',
          ...errorData,
        })
      } else {
        const newLink = new Link({ url })
        if (code) newLink._id = code.toLowerCase()

        newLink.save((err, link) => {
          if (err) {
            const error = (err.errors && (err.errors.url || err.errors._id))
              || (err.errmsg && err.errmsg.includes('duplicate')
              && 'El código personalizado no está disponible')
              || 'Hubo un error, por favor intenta de nuevo'

            console.error(`Error shortening ${url} to ${code}: ${error}`)
            res.render('index', { error, ...errorData })
          } else {
            res.redirect(`/@${code || link.id}`)
          }
        })
      }
    }
  })

web.route(['/@:linkId', '/link/:linkId'])
  .get((req, res) => {
    const linkId = slugify(req.params.linkId)
    Link.findById(linkId.toLowerCase(), (err, link) => {
      if (err) console.error(err)
      if (err || !link) {
        res.status(404).render('error')
      } else if (link.isDisabled) {
        res.render('disabled')
      } else {
        const data = {
          pageTitle: linkId,
          success: !link.clickCount && '¡Enlace acortado! Guarda esta página para volver a ver los siguientes detalles',
          shortUrlFull: `http://${config.app.domain}/${linkId}`,
          shortUrl: `${config.app.domain}/${linkId}`,
          clickCount: link.clickCount,
          longUrl: link.url,
        }
        qrcode.toDataURL(data.shortUrlFull, { width: 200 })
          .then((qrData) => res.render('link', { qrData, ...data }))
          .catch((qrError) => {
            console.error(qrError)
            res.render('link', data)
          })
      }
    })
  })

web.route(['/:linkId', '//:linkId'])
  .get((req, res) => {
    const linkId = slugify(req.params.linkId)
    Link.findById(linkId.toLowerCase(), (err, link) => {
      if (err) console.error(err)
      if (err || !link) {
        res.status(404).render('error')
      } else if (link.isDisabled) {
        res.render('disabled')
      } else {
        link.clickCount += 1
        link.save()
        res.redirect(301, link.url)
      }
    })
  })

web.route('*').get((req, res) => res.status(404).render('error'))

module.exports = web
