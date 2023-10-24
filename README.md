# hapi-cognito-auth

[![Continuous Integration](https://github.com/trinitiventures/hapi-cognito-auth/actions/workflows/ci.yml/badge.svg)](https://github.com/trinitiventures/hapi-cognito-auth/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This package adds a [Cognito](https://aws.amazon.com/cognito/) auth scheme to a hapi server

## Installation
```console
npm i @trinitiventures/hapi-cognito-auth
```

## Configuration
Below is an example of how to configure this plugin with [Confidence](https://github.com/hapipal/confidence) (pun intended ;)
```javascript
module.exports = new Confidence.Store({
  server: {
    port: {
      $env: 'PORT',
      $coerce: 'number',
      $default: 3000
    },
  register: {
    plugins: [
      {
        plugin: '@trinitiventures/hapi-cognito-auth'
      },
      {
        plugin: '../lib', // Main plugin
        options: {
          token: {
            aud: { $env: 'COGNITO_IDP_AUDIENCE' },
            iss: { $env: 'COGNITO_IDP_ISSUER' },
            use: 'id' //only accept idTokens
          },
          region: { $env: 'COGNITO_REGION' },
          userPoolId: { $env: 'COGNITO_USER_POOL_ID' },
          jwtSecretKey: { $env: 'JWT_SECRET_KEY' }
        }
      }
    ]
  }
})
```

This project is licensed under the terms of the MIT license.