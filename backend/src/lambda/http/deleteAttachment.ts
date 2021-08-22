import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { createLogger } from '../../utils/logger'
import { deleteAttachment } from '../../main/entries'
import { deleteObject } from '../../main/attachments'

const logger = createLogger('deleteAttachment')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Remove an Attachment by key
  const key = event.pathParameters.key
  const entryId = event.pathParameters.entryId

  logger.info(`delete attachment: ${key}, entryId: ${entryId}`)

  await deleteAttachment(entryId, `${entryId}/${key}`)
  await deleteObject(`${entryId}/${key}`)

  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
