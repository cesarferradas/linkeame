const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')

const config = require('../config')
const middleware = require('./middleware')
const User = require('../models/user')

const auth = express.Router()

auth.route('/register')
  .post((req, res, next) => {
    const { name, email, password } = req.body
    if (!email || !password) {
      next({
        status: 400,
        message: 'Se necesita email y contraseña',
      })
    }

    const newUser = new User()
    newUser.name = name || email.split('@')[0]
    newUser.email = email
    newUser.passwordHash = bcrypt.hashSync(req.body.password, config.saltRounds)

    newUser.save((err, user) => {
      if (err) {
        next({
          status: 400,
          message: 'No se pudo registrar, por favor intenta de nuevo',
          error: err,
        })
      } else {
        res.status(201).json(user)
      }
    })
  })

auth.route('/login')
  .post(middleware.rateLimit, (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        next({
          message: 'No se pudo iniciar sesion, por favor intenta de nuevo',
          error: err,
        })
      } else if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
        next({
          status: 401,
          message: 'Email o contraseña incorrecta',
        })
      } else {
        const token = jwt.sign(
          { eml: user.email },
          config.jwt.secret,
          {
            expiresIn: config.jwt.expires,
            subject: user.id,
            issuer: config.jwt.issuer,
          },
        )

        const header = token.split('.')[0]
        const payload = token.split('.')[1]
        const signature = token.split('.')[2]

        res.cookie('session_hp', `${header}.${payload}`, config.cookies)
        res.cookie('session_sig', signature, {
          ...config.cookies,
          httpOnly: true,
        })
        res.json(user)
      }
    })
  })

auth.route('/logout')
  .get((req, res) => {
    res.clearCookie('session_hp')
    res.clearCookie('session_sig')
    res.redirect('/')
  })

module.exports = auth
