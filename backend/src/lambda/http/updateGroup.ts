import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../../utils/utils'
import { UpdateGroupRequest } from '../../requests/UpdateGroupRequest'
import { getGroups, updateGroup } from '../../main/groups'
import { Group } from '../../models/Group'

const logger = createLogger('updateGroup')

/**
 * Update group name
 */
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const groupUpdate: UpdateGroupRequest = JSON.parse(event.body)
  const userIdRequest: string = getUserId(event)
  const group: Group = (await getGroups()).find(g => {
    return g.groupId === groupUpdate.groupId
  })
  
  var statusCode: number

  logger.info(`update group ${groupUpdate.groupId}`)
  logger.info(`update content ${JSON.stringify(groupUpdate)}`)

  if (group.owners.includes(userIdRequest)) {
    statusCode = 200
    await updateGroup(groupUpdate)
  } else {
    statusCode = 403
  }

  return {
    statusCode,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
