const Jwt = require('jsonwebtoken')
const { getPrivatePem } = require('../lib/auth/helpers/token')

const kid = 'kjd83hdnd93jdjdnf839='
const mockKeys = {
  keys: [
    {
      'p': '9wdxr5VMeweeTqn4tzGAtLkxt5fY1PGkAkw54uiQcXkj3pGLoXkPUAM5Ux-S3WZBMLtq7VF76C1gDmn1S6rzxO6L3lvBAJh3fNJU6Ni0E0T_YxuK4gmmgrWDeUYzY2O1sRaHuyaEBBjhAW3fKeQPtINzFbZWPHkRZXp3W1k9Pxc',
      'kty': 'RSA',
      'q': 'tZ_xJn-eKJf-yaBYFsZX569tivWvW2FEnkBxLz6shjm4SRvYgV9oP-i08mGPp-JUlvvXP-n2La9gQPCy7jf0YPZhgJFCT7X0023hCb2nl5HBNKPEp9Kp9bOUkeUVGGIPOKZC_i_Uv8Ypli4PEzus8GLUCA6IQjER_gvxGdXJ8js',
      'd': 'eZawAcPxYqJt1SQ0fD09VdJfkfM-BifFr4wloH7sYg9eWkvlkrpIJ1j-nQLQ2Tv9-591Z_S_3Ajk7wyXbZyKMYfGiCvFjDe_LMYWiBiSeiK8ruW6qPzX3N8v1p68Zbx1KVIDvixDtMKpnhz_gl6bYwNubVuIJxwiwNmLaGzSP9HIAA6IzEcms3gkDXZcI8Nm1HZhCYPeego9-0Af1GCGNZ4zUYcdZ2gIyo2rtSAN0oc5t15rgRKCQEBBqc_TNnkqGq4By_FK3PLnHBihSir4rZRn_TKkmd4LS4wcho70SsMp5WQcPQheqhxWamxkyeG7NKJBquCBkEduIgmOfRAmlQ',
      'e': 'AQAB',
      'use': 'sig',
      kid,
      'qi': 'n2NplxIhTeu0DniQJW-sMnYhCAzZ0iomv_ACC33H8O6_45Yne-kvmcZchbsCR9crfvEhqfcw5d3VrPSqocpLH2RUvoX0huhH640ahkarP3Zas27Oi6d6QdfnnYU_ulbNiU7uFqlZkAbNaqG53SI3sW_wkLl0b4TnON9VGV9lujI',
      'dp': 'eEk_qmfgnefPxi4t1cZdDaM_-k4OX2JqolPLvBnSe-6o8K-edjokoqlvOHKfaP9prvkT0AtlcmDl7R7bOsU7fiFKKjQzfr6_MCCbB-a9iMSINxIqRna8hdks89ijHTpoNprp7M-MaRJUPgXqLNPIcfWwDFqFE11Ag1Fm3SxPDnE',
      'alg': 'RS256',
      'dq': 'pVZwpOdQBww2-T1qc3Ej3NmqEvINLFajrJxlbOjVDWvGA2fB9CPyNxuUfYGq0N4Mu1WPYbOOU5BvQy7a9FkjspEXuX6CqyWtNju0vLVVt3kMNOtQvqXb6rwL57RvO78otB1GpzbLqbivavOK7atJh5uwAZWZHQimpGoila41JLk',
      'n': 'r0KZs-jjSEQQR-ax0teZXNyKpW1qocApNgu6rnIoJpQYOGhGfE70ijkR8b2PT_ObzFfRgvtxpNjePr4-nKC8uNkFTEcLJIJxaV6u-R7DLZuf9B8_HacfVPbAzuwrbLwNEpqhLbPUmzBRLExbrsxW1K2g_wDQS_e-tvrzcDMMrYPPZ3SLEOm7hz0PIgg0BVhriRmKF8U78GE2-y72_qlUOvv2CaScL1MvVw2EMVsFoKD5kM2hkk0YWYCieKixjso4Qooy2D4g3B4soH12U-AG-pFw3eStS8L45S-UUFtVWrVnozrKXsdpxQ6MOoXLg5_G-5SWYqtWxBbHY7M9ItBITQ'
    }
  ]
}

const getNewToken = (payload, iss, aud) => {
  const pem = getPrivatePem(mockKeys.keys, { private: true })
  return Jwt.sign(payload, pem[kid], { audience: aud, issuer: iss, algorithm: 'RS256', keyid: kid })
}

module.exports = {
  getNewToken,
  mockKeys
}
