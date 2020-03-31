const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const CognitoScheme = require('../../lib/auth/schemes/cognito')

const { describe, it } = exports.lab = Lab.script()
const { expect } = Code

const server = {
  log: () => {}
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
  it('errors out if no UserPool Id is passed in', () => {
    const options = {}
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a Cognito UserPoolId')
  })

  it('errors out if no validate function is passed in', () => {
    const options = { userPoolId: 'ap-southeast-2_jd848' }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a validate function')
  })

  it('errors out if validate function is not async', () => {
    const options = { userPoolId: 'ap-southeast-2_jd848', validate: () => {} }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('The validate function must be async')
  })

  it('errors out if there is no token in request', async () => {
    const options = { userPoolId: 'ap-southeast-2_jd848',
      validate: async (request, token) => { return await Promise.resolve() }
    }
    const request = {
      headers: {
        x: 'Bearer fjfjsidf'
      }
    }
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('returns credentials', async () => {
    const options = { userPoolId: 'ap-southeast-2_jd848',
      validate: async (request, token) => {
        return await Promise.resolve({ isValid: true, credentials: { id: 1, name: 'John' } })
      }
    }
    const request = {
      headers: {
        authorization: 'Bearer xidjfn'
      }
    }
    const s = CognitoScheme()

    const authentication = await s.scheme(server, options).authenticate(request, h)
    expect(authentication.credentials).to.equal({ isValid: true, credentials: { id: 1, name: 'John' } })
  })
})
