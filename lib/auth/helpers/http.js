const Hoek = require("@hapi/hoek");

const jwks = {};

const getJwks = async ({ region, userPoolId, wreck }) => {
  Hoek.assert(!!region, "Need an AWS region");
  Hoek.assert(!!userPoolId, "Need a Cognito UserPool ID");
  Hoek.assert(!!wreck, "Need an instance of Wreck");

  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

  if (!jwks[userPoolId]) {
    const response = await wreck.get(url, { json: true });
    jwks[userPoolId] = response.payload.keys;
  }

  return jwks[userPoolId];
};

module.exports = { getJwks };
