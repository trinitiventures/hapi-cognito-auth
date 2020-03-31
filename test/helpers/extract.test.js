const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const Extract = require('../../lib/auth/helpers/extract')

const { describe, it } = exports.lab = Lab.script()
const { expect } = Code

describe('Extract helpers', () => {
  it('extract Authorization header', () => {
    const token = Extract({
      headers: {
        authorization: 'dummy-id-token'
      }
    }, {})
    expect(token).to.equal('dummy-id-token')
  })

  it('extract Authorization header with Bearer', () => {
    const token = Extract({
      headers: {
        authorization: 'Bearer dummy-id-token'
      }
    }, {
      tokenType: 'Bearer'
    })
    expect(token).to.equal('dummy-id-token')
  })

  it('extract Url query', () => {
    const token = Extract({
      query: {
        token: 'dummy-id-token'
      }
    }, {})
    expect(token).to.equal('dummy-id-token')
  })

  it('extract Cookie', () => {
    const token = Extract({
      headers: {
        cookie: 'token=dummy-id-token;'
      }
    }, {})
    expect(token).to.equal('dummy-id-token')
  })
})
