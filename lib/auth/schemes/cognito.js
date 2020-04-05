const Util = require('util')
const Hoek = require('@hapi/hoek')
const Boom = require('@hapi/boom')
const Extract = require('../helpers/extract')
const GetJwks = require('../helpers/http')
const { DecodeToken, VerifyToken, GetPublicPem } = require('../helpers/token')

module.exports = () => {
  return {
    name: 'cognito',
    scheme: (server, options) => {
      const config = Hoek.applyToDefaults({
        region: 'ap-southeast-2',
        use: 'id',
        token: {
          algorithms: ['RS256']
        }
      }, options)

      Hoek.assert(!!config.token.aud, 'You need to provide a token audience')
      Hoek.assert(!!config.token.iss, 'You need to provide a token issuer')
      Hoek.assert(!!config.token.use, 'You need to provide a token use (i.e. either id or access)')
      Hoek.assert(!!config.region, 'You need to provide an AWS region')
      Hoek.assert(!!config.userPoolId, 'You need to provide a Cognito UserPoolId')
      Hoek.assert(!!config.validate, 'You need to provide a validate function')
      Hoek.assert(!!Util.types.isAsyncFunction(config.validate), 'The validate function must be async')
      Hoek.assert(!!config.wreck, 'Need an instance of Wreck')

      return {
        authenticate: async (request, h) => {
          // Verification steps provided by AWS:
          // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
          try {
            const token = Extract(request)
            if (!token) {
              throw Boom.unauthorized()
            }

            // Step 1: Confirm the Structure of the JWT
            const tokenParts = (token || '').split('.').length
            if (tokenParts !== 3) {
              request.log('error', 'Invalid token structure')
              throw Boom.unauthorized()
            }

            // Step 2: Validate the JWT Signature
            // 2.1 Decode token
            const decodedToken = DecodeToken(token)
            if (!decodedToken) {
              request.log('error', 'Cannot decode token')
              throw Boom.unauthorized()
            }

            // 2.2 Compare the local key ID (kid) to the public kid.
            const jwks = await GetJwks(config)
            const pems = GetPublicPem(jwks)
            const pem = pems[decodedToken.header.kid]
            if (!pem) {
              request.log('error', 'Invalid kid')
              throw Boom.unauthorized()
            }

            // 2.3 Use the public key to verify the signature
            const verifiedToken = VerifyToken(token, pem, { ...config.token })

            // Step 3: Verify claims
            // 3.1 Expiry, 3.2 aud and 3.3 iss are verified above in VerifyToken
            // 3.4 verify token use
            if (verifiedToken.payload.token_use !== config.token.use) {
              request.log('error', 'Invalid token use')
              throw Boom.unauthorized()
            }

            // Step 4: BYO validate function
            const result = await config.validate(verifiedToken, request, h)

            if (!result.isValid) {
              request.log('error', 'Validate function failed')
              throw Boom.unauthorized()
            }

            const credentials = result.credentials ? result.credentials : verifiedToken

            return h.authenticated({ credentials })
          } catch (e) {
            if (e.isBoom) {
              throw e
            }

            server.log('error', e)
            throw Boom.unauthorized()
          }
        }
      }
    }
  }
}
