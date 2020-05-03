const mongoose = require('mongoose')
const request = require('supertest')

const app = require('../src/app')
const config = require('../src/config')
const Link = require('../src/models/link')
const User = require('../src/models/user')


before((done) => {
  mongoose.connect(config.mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, done)
  // TODO seed DB
  // TODO mock redis client
})

after((done) => {
  Link.deleteMany({}, () => {
    User.deleteMany({}, done)
  })
})

describe('Base root', () => {
  it('returns success', (done) => {
    request(app)
      .get('/')
      .expect(200, done)
  })
})

describe('Base redirect', () => {
  xit('returns a redirect to a long url', (done) => {
    // TODO mock database call to find this Link
    request(app)
      .get('dY-Z2vk4X')
      .expect(404, done)
  })
  it('returns a page if link not found', (done) => {
    request(app)
      .get('/foobar')
      .expect(200, done)
  })
})

describe('/api/links', () => {
  it('requires authentication', (done) => {
    request(app)
      .post('/api/links')
      .expect(401, done)
  })
  xit('creates a link', (done) => {
    // TODO send valid JWT to prevent 401
    request(app)
      .post('/api/links')
      .expect(201, done)
  })
})

describe('api/auth/register', () => {
  it('creates a user', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({
        email: 'user1@facil.ink',
        password: 'password',
      })
      .expect(201, done)
  })
  xit('fails if user already exists', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@facil.ink',
        password: 'password',
      })
      .expect(400, done)
  })
})

describe('api/auth/login', () => {
  xit('returns a JWT', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@facil.ink',
        password: 'password',
      })
      .expect(200, done)
  })
  xit('returns unauthorized if credentials are incorrect', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@facil.ink',
        password: 'wrongpassword',
      })
      .expect(401, done)
  })
})
