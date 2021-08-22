import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logger'
import { Group } from '../../models/Group'
import { createGroup } from '../../main/groups'
import { getUserId } from '../../utils/utils'

const logger = createLogger('createGroup')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newGroup: Group = JSON.parse(event.body)
  const group: Group = await createGroup(newGroup, getUserId(event))

  logger.info(`creating group ${JSON.stringify(newGroup)}`)

  return {
    statusCode: 201,
    body: JSON.stringify({
      group
    })
  }
})

handler.use(cors({
  credentials: true
}))