const express = require('express')
const cors = require('cors')
const urlParser = require('url-parse')

const Link = require('../models/link')
const config = require('../config')

const api = express.Router()

api.use(cors(config.corsOptions))

api.route('/')
  .get((req, res) => {
    if (!req.headers['x-csrf-token']) {
      res.status(401).json({ error: 'Permiso denegado' })
    } else if (!req.query.u) {
      res.status(400).json({ error: 'Parametro "u" es requerido' })
    } else {
      const url = req.query.u
      const parsedUrl = urlParser(url)

      if (config.blacklistedDomains.includes(parsedUrl.hostname)) {
        res.status(400).json({ error: 'El dominio de este URL no está permitido' })
      } else {
        const newLink = new Link({ url })
        newLink.save((err, link) => {
          if (err || !link) {
            console.error(err)
            const error = (err.errors && err.errors.url) || 'No se pudo acortar el enlace'

            res.status(400).json({ error })
          } else {
            res.status(201).json({ data: `${config.app.domain}/${link.id}` })
          }
        })
      }
    }
  })

api.route('*')
  .all((req, res) => res.status(400).json({ error: 'No implementado' }))

module.exports = api
