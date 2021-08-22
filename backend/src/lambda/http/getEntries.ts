import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { getUserId } from '../../utils/utils'
import { getEntriesByUser } from '../../main/entries'
import { createLogger } from '../../utils/logger'
import { EntryItem } from '../../models/EntryItem'

const logger = createLogger('getEntries')

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all Entry items for a current user
  const userId = getUserId(event)
  var items: EntryItem[]

  logger.info(`getting entries for user ${userId}`)

  try {
    items = await getEntriesByUser(userId)
  } catch (e) {
    logger.error(`failed to get entries: ${e.message}`)
  }

  logger.info(`entries received: ${items}`)

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