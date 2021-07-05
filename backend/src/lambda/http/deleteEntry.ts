import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteEntry } from '../../main/entries'

const logger = createLogger('deleteEntry')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Remove an Entry item by id
  const entryId = event.pathParameters.entryId
  const userId = getUserId(event)

  logger.info(`delete entry: ${entryId}, userId: ${userId}`)

  await deleteEntry(entryId, userId)

  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
