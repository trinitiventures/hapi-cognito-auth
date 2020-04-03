const Boom = require('@hapi/boom')
const Hoek = require('@hapi/hoek')

let keys

const getJwks = async ({ region, userPoolId, wreck }) => {
  Hoek.assert(!!region, 'Need an AWS region')
  Hoek.assert(!!userPoolId, 'Need a Cognito UserPool ID')
  Hoek.assert(!!wreck, 'Need an instance of Wreck')

  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`

  try {
    if (!keys) {
      const response = await wreck.get(url, { json: true })
      keys = response.payload.keys
    }

    return keys
  } catch (e) {
    throw Boom.unauthorized() // don't leak sensetive data
  }
}

module.exports = getJwks
