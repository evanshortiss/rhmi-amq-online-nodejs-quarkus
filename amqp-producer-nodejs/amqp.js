const rhea = require('rhea')
const { randomBytes } = require('crypto')
const { AMQP } = require('./config')
const characters = require('./characters')

let counter = 0
const senderId = randomBytes(2).toString('hex')
const messaging = rhea.create_container({ id: senderId })

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.connect = function (log) {
  return new Promise((resolve) => {
    const interface = {
      getSendCount: () => counter
    }

    if (AMQP.DISABLED) {
      log.warn(`warning: not connecting to broker AMQP_DISABLED was set to "${AMQP.DISABLED}"`)
      return resolve(interface)
    } else {
      log.info('connecting to message broker with settings:', AMQP)

      messaging.on('error', err => {
        log.error(err)
        log.error(`exiting worker ${senderId} with status 1`)
        process.exit(1)
      })

      messaging.on('connection_open', (e) => {
        log.info('connected to broker')

        const connection = e.connection

        // Send a transaction message every 5 seconds
        setInterval(() => {
          const id = `${senderId}/${counter++}`
          const payload = {
            to: AMQP.QUEUE_NAME,
            id,
            body: JSON.stringify({
              amount: getRandomInt(1, 1000),
              character: characters[getRandomInt(0, characters.length - 1)],
              timestamp: new Date().toJSON()
            })
          }

          log.info('sending payload to queue:', payload)

          connection.send(payload)
        }, 5000)

        resolve(interface)
      })

      messaging.connect({
        port: AMQP.PORT,
        host: AMQP.HOST,
        username: AMQP.USER,
        password: AMQP.PASS
      })
    }
  })
}
