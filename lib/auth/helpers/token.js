const Jwt = require('jsonwebtoken')
const JwkToPem = require('jwk-to-pem')

const decodeToken = (token) => {
  return Jwt.decode(token, { complete: true })
}

const verifyToken = (token, pem, verifyOptions) => {
  return Jwt.verify(token, pem, {
    complete: true,
    audience: verifyOptions.aud,
    issuer: verifyOptions.iss,
    algorithms: verifyOptions.algorithms
  })
}

const verifyTokenSecretKey = (token, pem, verifyOptions) => {
  return Jwt.verify(token, pem, {
    complete: true,
    issuer: verifyOptions.iss,
    algorithms: verifyOptions.algorithms
  })
}

const getPublicPem = (jwks, options = {}) => {
  const pems = {}

  for (let i = 0; i < jwks.length; ++i) {
    const keyId = jwks[i].kid
    const keyType = jwks[i].kty
    const modulus = jwks[i].n
    const exponent = jwks[i].e
    const jwk = { kty: keyType, n: modulus, e: exponent }
    const pem = JwkToPem(jwk, options)
    pems[keyId] = pem
  }

  return pems
}

const getPrivatePem = (jwks) => {
  const pems = {}

  for (let i = 0; i < jwks.length; ++i) {
    const keyId = jwks[i].kid
    const kty = jwks[i].kty
    const n = jwks[i].n
    const e = jwks[i].e
    const d = jwks[i].d
    const p = jwks[i].p
    const q = jwks[i].q
    const dp = jwks[i].dp
    const dq = jwks[i].dq
    const qi = jwks[i].qi
    const jwk = { kty, n, e, d, p, q, dp, dq, qi }
    const pem = JwkToPem(jwk, { private: true })
    pems[keyId] = pem
  }

  return pems
}

module.exports = {
  decodeToken,
  verifyToken,
  verifyTokenSecretKey,
  getPublicPem,
  getPrivatePem
}
