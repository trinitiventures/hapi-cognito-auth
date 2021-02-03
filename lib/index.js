const HauteCouture = require('@hapipal/haute-couture')
const Package = require('../package.json')

exports.plugin = {
  pkg: Package,
  register: async (server, options) => {
    await HauteCouture.compose(server, options)
  },
  requirements: {
    hapi: '>=20'
  }
}
