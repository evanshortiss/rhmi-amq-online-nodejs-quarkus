const fastify = require('fastify')({ logger: true })
const amqp = require('./amqp')
const config = require('./config')

const startTime = Date.now()

fastify.register(require('point-of-view'), {
  engine: {
    handlebars: require('handlebars')
  }
})

fastify.register(async (server, options, next) => {
  const sender = await amqp.connect(fastify.log)

  // Make the amqp interface available on the fastify instance
  fastify.decorate('amqp', sender)

  next()
})

fastify.get('/', (request, reply) => {
  const uptimeSeconds = Math.round(Date.now() - startTime) / 1000
  let uptime = uptimeSeconds

  if (uptimeSeconds >= (60 * 60)) {
    // If uptime is over one hour find uptime hours and mins
    const hours = Math.floor(uptimeSeconds / 60 / 60)
    const mins = Math.round((uptimeSeconds - (hours * 60 * 60)) / 60)

    uptime = `${hours} hours and ${mins} minutes`
  } else if (uptimeSeconds >= 60) {
    // If over a minute then list mins and seconds
    const mins = Math.round(uptimeSeconds / 60)
    const seconds = Math.round(uptime - mins * 60)
    uptime = `${mins} minutes and ${seconds} seconds`
  } else {
    uptime = `${uptime} seconds`
  }

  reply.view('/templates/index.hbs', {
    queueConfig: JSON.stringify(config.AMQP, null, 2),
    sendCount: fastify.amqp.getSendCount(),
    uptime
  })
})

fastify.listen(config.PORT, '0.0.0.0', (err) => {
  if (err) {
    fastify.log.error(err, 'error starting the server')
    process.exit(1)
  }
})
