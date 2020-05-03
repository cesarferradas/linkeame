const express = require('express')

const Link = require('../models/link')
const middleware = require('./middleware')

const api = express.Router()

api.use(middleware.rateLimit)

api.route('/links')
  .post(middleware.requireAuth, (req, res, next) => {
    // TODO allow custom link codes
    const newLink = new Link(req.body)
    if (req.user) {
      newLink.user = req.user.sub
    }
    newLink.save((err, link) => {
      if (err) {
        next({
          message: 'No se pudo crear el link',
          error: err,
        })
      } else {
        res.json(link)
      }
    })
  })

  .get(middleware.requireAuth, (req, res, next) => {
    Link.find({ user: req.user.sub }).sort('-createdAt').exec((err, links) => {
      if (err || !links) {
        next({
          message: 'No se pudo encontrar links',
          error: err,
        })
      } else {
        res.json(links)
      }
    })
  })

api.route('*')
  .all((req, res, next) => {
    next({
      status: 400,
      message: `${req.method} ${req.url} not implemented`,
    })
  })

module.exports = api
