// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'qw59cu9nwk'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'baninho.eu.auth0.com',            // Auth0 domain
  clientId: 'KQVJ4a6Bqzgs51ldFCWD427VGukqUSNj',          // Auth0 client id
  callbackUrl: 'http://lab-report-client-dev.eu-central-1.elasticbeanstalk.com/callback'
}
