const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const GetJwks = require('../../lib/auth/helpers/http')

const { describe, it } = exports.lab = Lab.script()
const { expect } = Code

const mock = {
  keys: [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'NhDOANmEtSmTqXSDv7LMCypVSnsy4wZMxfq0qi6wkH8=',
      kty: 'RSA',
      n: 'uatFQzFQdIRcUBYBeSSKpjmFsWN0TAw68jurKKU-DPDFojJAQ9tFkdixbtlzNA3uzHYkqUVViOCBH2Gt61x0VdfeDZYaAgSjFrlBT6DITKPXyEDBJdcduPtWVdeSxwhB0rLv-3ikemKXP1Kl5wPOCL6u2V_Yr_VUIe-FJeBKcDJi3aVKlfqbEjDaPflu5pHsGMxfLOU3-UbkfZ2Im-P9NyD1SPLPYOfiRHgvzIcaxyxVTGZMWACrU8jeXxgeQNVs4RLOVAngaNl7rxQqCWZNi1CK2lUyw6Uj_J8yk8K1-kNRHWUhK94v30Jg3g3NrYxTnFLiC8y3sTm7N3mb5SGIKQ',
      use: 'sig'
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'q4aZipX00354ZNBhI3IMc5At4rcMT2LyaAPqZIM6jC4=',
      kty: 'RSA',
      n: 'scaomF8NYL3Upnc_0ZXlBBGzS2VNhWLCqBfwUgablOGiIDkW8jOLxZibolCn9WKgejApHSitGvi4QKPKxeKgc5MXOpdPzyZRS9g63_IT9JKLu2J3GlTUFUdhyPH1TdhP57P0sFkOZzuA0JvuWJ_I_wPL0oj0YjTpU9XCG55PZylMh2ORX2bm_fGjqnVQehHwqJIxevqC-5_ib9d2LP4qH5xnYFO6gPxNr2F-CnmrkZ_TiOIB0znDB3v-Vzf7M14uX5jHBcQJzOAyJwDS62lMM-WZx08BHgCiF3umpQ4mzGmujJwsy6QD7CWHrSC37AX8pRztzKt34ALju7THhBb9kQ',
      use: 'sig'
    }
  ]
}

describe('Http helpers', () => {
  it('errors out with no AWS region', () => {
    const options = {}

    expect(GetJwks(options)).to.reject('Need an AWS region')
  })

  it('errors out with no Cognito User Pool Id', () => {
    const options = {
      region: 'ap-southeast-2'
    }

    expect(GetJwks(options)).to.reject('Need a Cognito UserPool ID')
  })

  it('errors out with instance of Wreck', () => {
    const options = {
      region: 'ap-southeast-2',
      userPoolId: 'ap-southeast-2_hA1Lsl9Gb'
    }

    expect(GetJwks(options)).to.reject('Need an instance of Wreck')
  })

  it('returns JWKs', async () => {
    const options = {
      region: 'ap-southeast-2',
      userPoolId: 'ap-southeast-2_hA1Lsl9Gb',
      wreck: {
        get: async () => await Promise.resolve({ payload: mock })
      }
    }

    const result = await GetJwks(options)

    expect(result).to.be.an.object()
    expect(result.keys).to.be.an.array()
  })
})
