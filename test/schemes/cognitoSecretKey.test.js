const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const CognitoScheme = require('../../lib/auth/schemes/cognitoSecretKey')
const { getNewToken, mockKeys } = require('../utils')

const { describe, it } = exports.lab = Lab.script()
const { expect } = Code

const server = {
  // eslint-disable-next-line no-console
  log: console.log
}
const getRequest = (token) => ({
  // eslint-disable-next-line no-console
  log: console.log,
  headers: {
    authorization: `Bearer ${token}`
  }
})

const h = {
  authenticated: (data) => {
    return data
  },
  unauthenticated: (error) => {
    throw error
  }
}
const wreckMock = {
  get: async () => {
    return await Promise.resolve({
      payload: {
        keys: mockKeys.keys
      }
    })
  }
}
const tokenOptions = {
  aud: 'my_audience',
  iss:  'https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_some_random_id',
  use: 'id'
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
      token: tokenOptions
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a Cognito UserPoolId')
  })

  it('errors out if no validate function is passed in', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'some_random_id'
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('You need to provide a validate function')
  })

  it('errors out if validate function is not async', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'some_random_id',
      validate: () => {}
    }
    const s = CognitoScheme()

    expect(() => s.scheme(server, options)).to.throw('The validate function must be async')
  })

  it('errors out if there is no token in request', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'some_random_id',
      validate: async () => { return await Promise.resolve() },
      wreck: wreckMock
    }
    const request = {
      headers: {
        x: 'something'
      }
    }
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('errors out if token is in wrong format', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'some_random_id',
      validate: async () => { return await Promise.resolve() },
      wreck: wreckMock
    }
    const request = getRequest('111.2222')
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('errors out if validate function fails to return', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async () => {
        return await Promise.resolve({ isValid: false })
      },
      wreck: wreckMock
    }
    const token = getNewToken({ sub: 1, given_name: 'John', token_use: 'id' }, options.token.iss, options.token.aud)

    const request = getRequest(token)
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('errors out if there is token use mismatch', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async () => {
        return await Promise.resolve({ isValid: true })
      },
      wreck: wreckMock
    }
    const token = getNewToken({ sub: 1, given_name: 'John', token_use: 'access' }, options.token.iss, options.token.aud)

    const request = getRequest(token)
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('errors out if cannot decode token due to wrong issuer', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async () => {
        return await Promise.resolve({ isValid: true })
      },
      wreck: wreckMock
    }
    const token = getNewToken({ sub: 1, given_name: 'John', token_use: 'access' }, 'random_issuer', options.token.aud)

    const request = getRequest(token)
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('errors out if cannot decode token due to wrong audience', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async () => {
        return await Promise.resolve({ isValid: true })
      },
      wreck: wreckMock
    }
    const token = getNewToken({ sub: 1, given_name: 'John', token_use: 'access' }, options.token.iss, 'wrong_aud')

    const request = getRequest(token)
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('errors out if token is tampered with', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async () => {
        return await Promise.resolve({ isValid: true })
      },
      wreck: wreckMock
    }
    let token = getNewToken({ sub: 1, given_name: 'John', token_use: 'access' }, options.token.iss, 'wrong_aud')
    token += 'tampered'

    const request = getRequest(token)
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('errors out if cannot decode token', () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async () => {
        return await Promise.resolve({ isValid: true })
      },
      wreck: wreckMock
    }

    const request = getRequest('e.e.e')
    const s = CognitoScheme()

    expect(s.scheme(server, options).authenticate(request, h)).to.reject('Unauthorized')
  })

  it('returns credentials', async () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async (decoded) => {
        return await Promise.resolve({
          isValid: true,
          credentials: { id: decoded.payload.sub, name: decoded.payload.given_name }
        })
      },
      wreck: wreckMock
    }
    const token = getNewToken({ sub: 1, given_name: 'John', token_use: 'id' }, options.token.iss, options.token.aud)

    const request = getRequest(token)
    const s = CognitoScheme()

    const authentication = await s.scheme(server, options).authenticate(request, h)
    expect(authentication).to.equal({ credentials: { id: 1, name: 'John' } })
  })

  it('returns original token if validate function does not return credential', async () => {
    const options = {
      token: tokenOptions,
      userPoolId: 'ap-southeast-2_some_random_id',
      validate: async () => {
        return await Promise.resolve({ isValid: true })
      },
      wreck: wreckMock
    }
    const token = getNewToken({ sub: 1, given_name: 'John', token_use: 'id' }, options.token.iss, options.token.aud)

    const request = getRequest(token)
    const s = CognitoScheme()

    const authentication = await s.scheme(server, options).authenticate(request, h)
    expect(authentication.credentials.sub).to.equal(1)
    expect(authentication.credentials.given_name).to.equal('John')
    expect(authentication.credentials.token_use).to.equal('id')
  })
})
