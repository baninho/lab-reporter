import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'
import { getEntriesByUser } from '../../main/entries'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getEntries')

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all Entry items for a current user
  const userId = getUserId(event)

  logger.info(`getting entries for user ${userId}`)

  const items = await getEntriesByUser(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
})

handler.use(cors({
  credentials: true
}))