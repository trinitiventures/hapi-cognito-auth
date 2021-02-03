const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { getJwks } = require('../../lib/auth/helpers/http')
const { mockKeys }  = require('../utils')

const { describe, it } = exports.lab = Lab.script()
const { expect } = Code

describe('Http helpers', () => {
  it('errors out with no AWS region', () => {
    const options = {}

    expect(getJwks(options)).to.reject('Need an AWS region')
  })

  it('errors out with no Cognito User Pool Id', () => {
    const options = {
      region: 'ap-southeast-2'
    }

    expect(getJwks(options)).to.reject('Need a Cognito UserPool ID')
  })

  it('errors out with instance of Wreck', () => {
    const options = {
      region: 'ap-southeast-2',
      userPoolId: 'ap-southeast-2_hA1Lsl9Gb'
    }

    expect(getJwks(options)).to.reject('Need an instance of Wreck')
  })

  it('returns JWKs', async () => {
    const options = {
      region: 'ap-southeast-2',
      userPoolId: 'ap-southeast-2_hA1Lsl9Gb',
      wreck: {
        get: async () => await Promise.resolve({ payload: mockKeys })
      }
    }

    const keys = await getJwks(options)

    expect(keys).to.be.an.array()
  })
})
