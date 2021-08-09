import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteAttachment } from '../../main/entries'
import { deleteObject } from '../../main/attachments'

const logger = createLogger('deleteAttachment')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Remove an Attachment by key
  const key = event.pathParameters.key
  const entryId = event.pathParameters.entryId
  const userId = getUserId(event)

  logger.info(`delete attachment: ${key}, entryId: ${entryId}`)

  await deleteAttachment(entryId, `${entryId}/${key}`, userId)
  await deleteObject(`${entryId}/${key}`)

  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
