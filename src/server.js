const app = require('./app')
const config = require('./config')

app.listen(config.port, () => {
  console.info(`Server running on port ${config.port}`)
})
