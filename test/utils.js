const Jwt = require('jsonwebtoken')

const mock = {
  keys: [
    {
      'alg': 'RS256',
      'e': 'AQAB',
      'kid': 'x7TBQvDgoVc9vNinxmAD5aNylj1lxaiQOx2CRHZYipQ=',
      'kty': 'RSA',
      'n': 'vfPY8o48w6n0qpMsb47oprd950kQl64dn8VdKj35wTRa_QSF7zWUIaIvQHCAPL0MD8xKBGj94nlptq_bxuBPxVDPvKjMQfQlfVtOU57C4xQWyosnZoiCmVr-QfJA6jORDqiJH6GUAKC19-YTEzUgYXh7_VULB7qXj882oiESNbNXS4S09QeFZevAeK5Os0PCD_6m7QRJOlT0VJRacCKKDyxVx20gwc5w5VxyCP-PmdZSEWAuhdeau1w_IgahxS9VBfNWNs82RN0OY_muns80DH3YDe40Z7_E3OorWLWnRA1SjedYjtR3wXT4rhtXotZdl69sGZ0f79PEoujnD7ijUw',
      'use': 'sig'
    },
    {
      'alg': 'RS256',
      'e': 'AQAB',
      'kid': 'JJaKr08evatN2hdkyqrSGR+Oni9W8Ee0pdLDTqa5i9g=',
      'kty': 'RSA',
      'n': 'gSMKR4-yHuH_qEYaWUEBTwZUnCKk46JKtMXmd5AaQErZ7LL1Gu29yUbgaNLB4jkC9JwPKszyTZh0C7ymUDz_uY3bXXO663ojbh9YTR72x61sP_UT7CKuVSD_5jrgz3yYM2pb6-nIHyxrfkfzsSA1Lw72yLR6qPLg8ylIhbmrLusnozLblwzq6y6nfBKRoSD9HCVZ39ZiSzSWTWSIZK5dL9OZeiClhAmf0JnjL-CbqrMs9TH8UhRMIQwbA-hcUoi19avpLcnjmq17L16GrcQAvUIuBRiF_L9HRI1E-i0vZiHiNRw_t-ZsMkDuKkutt_Io74_A-XnMAx7rDBiq-SYHlQ',
      'use': 'sig'
    }
  ]
}

const getNewToken = (payload, iss, aud) => {
  return Jwt.sign(payload, 'my_secret', { audience: aud, issuer: iss })
}

module.exports = {
  GetNewToken: getNewToken,
  JwksMock: mock
}
