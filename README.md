# hapi-cognito-auth

[![Continuous Integration](https://github.com/trinitiventures/hapi-cognito-auth/actions/workflows/ci.yml/badge.svg)](https://github.com/trinitiventures/hapi-cognito-auth/actions/workflows/ci.yml)

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
        plugin: '@trinitiventures/hapi-cognito-auth',
        options: {
          token: {
          aud: { $env: 'COGNITO_IDP_AUDIENCE' },
          iss: { $env: 'COGNITO_IDP_ISSUER' },
          use: 'id' //only accept idTokens
          },
          userPoolId: { $env: 'COGNITO_USER_POOL_ID' },
        }
      },
      {
        plugin: '../lib',
        options: {}
      }
    ]
  }
})
```

This project is licensed under the terms of the MIT license.