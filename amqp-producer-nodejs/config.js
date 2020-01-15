'use strict'

const env = require('env-var')

const AMQP_DISABLED = env.get('AMQP_DISABLED', 'false').asBool()

const config = {
  NODE_ENV: env.get('NODE_ENV').asEnum(['development', 'production']),
  PORT: env.get('PORT', '8080').asPortNumber(),
  AMQP: {
    DISABLED: AMQP_DISABLED,
    USER: env.get('AMQP_USER', 'quarkus').asString(),
    PASS: env.get('AMQP_PASS', 'quarkus').asString(),
    HOST: env.get('AMQP_HOST', 'amq').asString(),
    PORT: env.get('AMQP_PORT', '5672').asPortNumber(),
    QUEUE_NAME: env.get('AMQP_QUEUE_NAME', 'rebel-transactions').asString()
  }
}

module.exports = config
