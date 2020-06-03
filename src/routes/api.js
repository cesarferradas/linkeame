const express = require('express')
const cors = require('cors')

const Link = require('../models/link')
const config = require('../config')

const api = express.Router()

api.use(cors(config.corsOptions))

api.route('/')
  .get((req, res) => {
    if (!req.headers['x-csrf-token']) {
      res.status(401).json({ error: 'Unauthorized' })
    } else if (!req.query.u) {
      res.status(400).json({ error: 'Parametro "u" es requerido' })
    } else {
      const url = req.query.u
      const newLink = new Link({ url })
      newLink.save((err, link) => {
        if (err || !link) {
          console.error(err)
          res.status(400).json({ error: 'No se pudo acortar' })
        } else {
          res.json({ data: `${config.app.domain}/${link.id}` })
        }
      })
    }
  })

api.route('*')
  .all((req, res) => {
    res.status(400).json({ error: 'No implementado' })
  })

module.exports = api
