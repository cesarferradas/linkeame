const mongoose = require('mongoose')
const request = require('supertest')

const app = require('../src/app')
const config = require('../src/config')
const Link = require('../src/models/link')

before((done) => {
  mongoose.connect(config.mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, done)
  // TODO seed DB
})

after((done) => {
  Link.deleteMany({}, done)
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
