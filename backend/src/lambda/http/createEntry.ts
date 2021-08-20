import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { CreateEntryRequest } from '../../requests/CreateEntryRequest'
import { EntryItem } from '../../models/EntryItem'
import { getUserId } from '../../utils/utils'
import { createEntry } from '../../main/entries'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createEntry')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newEntry: CreateEntryRequest = JSON.parse(event.body)
  const entryItem: EntryItem = await createEntry(newEntry, getUserId(event))

  logger.info(`creating entry ${JSON.stringify(entryItem)}`)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: entryItem
    })
  }
})

handler.use(cors({
  credentials: true
}))