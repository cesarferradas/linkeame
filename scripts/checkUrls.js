const axios = require('axios')
const mongoose = require('mongoose')

const config = require('../src/config')
const Link = require('../src/models/link')

const connect = () => {
  mongoose.connect(config.mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 5000,
  })
    .then(() => console.info('Connected to database'))
    .catch((err) => console.error(`Could not connect to MongoDB ${err}`))
}

const disconnect = () => {
  mongoose.disconnect()
}

connect()

const client = axios.create({
  baseURL: config.phishtank.url,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': `phishtank/${config.phishtank.username}`,
  },
})

client.get(`/${config.phishtank.appKey}/online-valid.json`)
  .then((res) => {
    let processed = 0
    const list = res.data

    console.info(`Inspecting ${list.length} URLs`)
    list.forEach((item) => {
      const { url } = item
      Link.updateMany({ url, isDisabled: false }, { isDisabled: true }, (err, resp) => {
        if (resp.nModified) {
          console.info(`Disabled ${resp.nModified} links with ${url}`)
        }
        processed += 1
        if (processed === list.length) disconnect()
      })
    })
  })
  .catch((err) => console.error(err))
