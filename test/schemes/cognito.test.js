/* eslint-disable no-console */
const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const CognitoScheme = require('../../lib/auth/schemes/cognito')
const { GetNewToken, JwksMock } = require('../utils')

const { describe, it } = exports.lab = Lab.script()
const { expect } = Code

const server = {
  log: console.log
}
const h = {
  authenticated: (data) => {
    return data
  },
  unauthenticated: (error) => {
    throw error
  }
}

describe('Cognito Auth Scheme', () => {
  it('errors out if no token aud is passed in', () => {
    const options = {}
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a token audience')
  })

  it('errors out if no token iss is passed in', () => {
    const options = {
      token: {
        aud: 'my_audience'
      }
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a token issuer')
  })

  it('errors out if no token use is passed in', () => {
    const options = {
      token: {
        aud: 'audience',
        iss: 'issuer'
      }
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a token use (i.e. either id or access)')
  })

  it('errors out if no UserPool Id is passed in', () => {
    const options = {
      token: {
        aud: 'audience',
        iss: 'issuer',
        use: 'id'
      }
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a Cognito UserPoolId')
  })

  it('errors out if no validate function is passed in', () => {
    const options = {
      token: {
        aud: 'audience',
        iss: 'issuer',
        use: 'id'
      },
      userPoolId: 'ap-southeast-2_jd848'
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a validate function')
  })

  it('errors out if validate function is not async', () => {
    const options = {
      token: {
        aud: 'audience',
        iss: 'issuer',
        use: 'id'
      },
      userPoolId: 'ap-southeast-2_jd848',
      validate: () => {}
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('The validate function must be async')
  })

  it('errors out if there is no token in request', () => {
    const options = {
      token: {
        aud: 'audience',
        iss: 'issuer',
        use: 'id'
      },
      userPoolId: 'ap-southeast-2_jd848',
      validate: async () => { return await Promise.resolve() },
      wreck: {
        get: async () => {
          return await Promise.resolve({
            payload: {
              keys: JwksMock.keys
            }
          })
        }
      }
    }
    const request = {
      log: console.log,
      headers: {
        x: 'Bearer fjfjsidf'
      }
    }
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('returns credentials', async () => {
    const options = {
      token: {
        aud: 'my_audience',
        iss:  'https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_some_random_id',
        use: 'id'
      },
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async (decoded) => {
        return await Promise.resolve({
          isValid: true,
          credentials: { id: decoded.payload.sub, name: decoded.payload.given_name }
        })
      },
      wreck: {
        get: async () => {
          return await Promise.resolve({
            payload: {
              keys: JwksMock.keys
            }
          })
        }
      }
    }
    const token = GetNewToken({ sub: 1, given_name: 'John', token_use: 'id' }, options.token.iss, options.token.aud)

    const request = {
      log: console.log,
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const s = CognitoScheme()

    const authentication = await s.scheme(server, options).authenticate(request, h)
    expect(authentication).to.equal({ credentials: { id: 1, name: 'John' } })
  })
})
