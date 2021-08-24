import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logger'
import { updateUser } from '../../main/users'
import { UpdateUserRequest } from '../../requests/UpdateUserRequest'
import { getUserId } from '../../utils/utils'

const logger = createLogger('updateUser')

/**
 * Update User name or groups
 */
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userUpdate: UpdateUserRequest = JSON.parse(event.body)
  const userIdRequest: string = getUserId(event)
  
  var statusCode: number

  logger.info(`update user ${userUpdate.userId}`)
  logger.info(`update content ${JSON.stringify(userUpdate)}`)

  if (userUpdate.userId !== userIdRequest) {
    statusCode = 403
  } else {
    statusCode = 200
    await updateUser(userUpdate, userIdRequest)
  }

  return {
    statusCode,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
