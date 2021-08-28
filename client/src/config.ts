const apiId = 'qw59cu9nwk'
const callbackUrlLocal = 'http://localhost:3000/callback'
//const callbackUrlEb = 'http://lab-report-client-dev.eu-central-1.elasticbeanstalk.com/callback'
const callbackUrlHeroku = 'https://mushroom-lab.herokuapp.com/callback'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

let cbUrl = process.env.NODE_ENV === 'development' ? callbackUrlLocal : callbackUrlHeroku

export const authConfig = {
  domain: 'baninho.eu.auth0.com',            // Auth0 domain
  clientId: 'KQVJ4a6Bqzgs51ldFCWD427VGukqUSNj',          // Auth0 client id
  callbackUrl: cbUrl
}
