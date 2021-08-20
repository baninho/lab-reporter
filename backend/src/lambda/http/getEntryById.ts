import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { getEntryById } from '../../main/entries'
import { createLogger } from '../../utils/logger'
import { EntryItem } from '../../models/EntryItem'

const logger = createLogger('getEntryById')

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get Entry by Id
  const entryId = event.pathParameters.entryId

  logger.info(`getting entry ${entryId}`)

  const entry: EntryItem = await getEntryById(entryId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      entry
    })
  }
})

handler.use(cors({
  credentials: true
}))