import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay  from 'aws-xray-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
import { radix64 } from '../../utils/radix64';

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const logger = createLogger('uploadUrl')

const bucketName = process.env.ATTACHMENTS_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body)
  const entryId: string = event.pathParameters.entryId
  const fileExt: string = body.fileExt ? `.${body.fileExt}` : ''
  const attachmentId: string = radix64(uuid.v4())
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${entryId}/${attachmentId + fileExt}`

  logger.info(`Upload URL for entry ${entryId} requested`)

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `${entryId}/${attachmentId + fileExt}`,
    Expires: parseInt(urlExpiration)
  })

  // Return a presigned URL to upload a file for an entry item with the provided id
  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: uploadUrl,
      attachmentUrl
    })
  }
})

handler.use(cors({
  credentials: true
}))