import { APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logger'
import { getGroups } from '../../main/groups'

const logger = createLogger('getEntries')

/**
 * Get all the groups
 */
export const handler = middy( async (): Promise<APIGatewayProxyResult> => {

  logger.info(`getting groups`)

  const items = await getGroups()

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