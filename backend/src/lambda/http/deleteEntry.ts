import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../../utils/utils'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { createLogger } from '../../utils/logger'
import { deleteEntry } from '../../main/entries'
import { deleteAllObjects } from '../../main/attachments'

const logger = createLogger('deleteEntry')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Remove an Entry item by id
  const entryId = event.pathParameters.entryId
  const userId = getUserId(event)

  logger.info(`delete entry: ${entryId}, userId: ${userId}`)

  await deleteAllObjects(entryId)
  await deleteEntry(entryId)

  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
