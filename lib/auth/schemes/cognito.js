const Util = require('util')
const Hoek = require('@hapi/hoek')
const Boom = require('@hapi/boom')
const Wreck = require('@hapi/wreck')
const Extract = require('../helpers/extract')
const GetJwks = require('../helpers/http')

module.exports = () => {
  return {
    name: 'cognito',
    scheme: (server, options) => {
      const config = Hoek.applyToDefaults({ region: 'ap-southeast-2', wreck: Wreck }, options)

      Hoek.assert(!!config.region, 'You need to provide an AWS region')
      Hoek.assert(!!config.userPoolId, 'You need to provide a Cognito UserPoolId')
      Hoek.assert(!!config.validate, 'You need to provide a validate function')
      Hoek.assert(!!Util.types.isAsyncFunction(config.validate), 'The validate function must be async')

      return {
        authenticate: async (request, h) => {
          try {
            const token = Extract(request)

            if (!token) {
              throw Boom.unauthorized()
            }

            const jwks = GetJwks(config)

            const result = await config.validate(request, token)

            if (!result.isValid) {
              throw Boom.unauthorized()
            }

            return h.authenticated({ credentials: result })
          } catch (error) {
            server.log('error', error)

            if (error.isBoom) {
              throw error
            }

            throw Boom.unauthorized()
          }
        }
      }
    }
  }
}
