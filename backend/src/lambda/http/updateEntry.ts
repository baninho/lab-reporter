import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { UpdateEntryRequest } from '../../requests/UpdateEntryRequest'
import { getUserId } from '../../utils/utils'
import { createLogger } from '../../utils/logger'
import { updateEntry } from '../../main/entries'

const logger = createLogger('updateEntry')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Update an entry item with the provided id using values in the "updatedEntry" object
  const entryId = event.pathParameters.entryId
  const userId = getUserId(event)
  const updatedEntry: UpdateEntryRequest = JSON.parse(event.body)

  logger.info(`update entry ${entryId}`)
  logger.info(`update content ${JSON.stringify(updatedEntry)}`)

  await updateEntry(updatedEntry, entryId, userId)

  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
