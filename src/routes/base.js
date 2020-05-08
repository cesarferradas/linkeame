const express = require('express')

const config = require('../config')
const Link = require('../models/link')

const base = express.Router()

base.route('/')
  .get((req, res) => res.send(config.app.name))

base.route('/:linkId')
  .get((req, res) => {
    let domain = req.hostname
    if (!config.availableDomains.includes(domain)) {
      [domain] = config.availableDomains
    }

    Link.findOne({ _id: req.params.linkId, domain }, (err, link) => {
      if (err || !link) {
        // TODO render error page
        res.send('Not found')
      } else {
        link.clickCount += 1
        link.save()
        res.redirect(link.url)
      }
    })
  })

module.exports = base
