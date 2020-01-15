'use strict'

const env = require('env-var')

const AMQP_DISABLED = env.get('AMQP_DISABLED', 'false').asBool()

const config = {
  NODE_ENV: env.get('NODE_ENV').asEnum(['development', 'production']),
  PORT: env.get('PORT', '8080').asPortNumber(),
  AMQP: {
    DISABLED: AMQP_DISABLED,
    USER: env.get('AMQP_USER', 'quarkus').required(!AMQP_DISABLED).asString(),
    PASS: env.get('AMQP_PASS', 'quarkus').required(!AMQP_DISABLED).asString(),
    HOST: env.get('AMQP_HOST', '0.0.0.0').required(!AMQP_DISABLED).asString(),
    PORT: env.get('AMQP_PORT', '5672').required(!AMQP_DISABLED).asPortNumber(),
    QUEUE_NAME: env.get('AMQP_QUEUE_NAME', 'rebel-transactions').required(!AMQP_DISABLED).asString()
  }
}

module.exports = config
