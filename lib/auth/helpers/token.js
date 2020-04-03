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

const getPem = (jwks) => {
  const pems = {}

  for (let i = 0; i < jwks.length; ++i) {
    const keyId = jwks[i].kid
    const modulus = jwks[i].n
    const exponent = jwks[i].e
    const keyType = jwks[i].kty
    const jwk = { kty: keyType, n: modulus, e: exponent }
    const pem = JwkToPem(jwk)
    pems[keyId] = pem
  }

  return pems
}

module.exports = {
  DecodeToken: decodeToken,
  VerifyToken: verifyToken,
  GetPem: getPem
}
