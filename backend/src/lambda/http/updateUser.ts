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

  logger.info(`update user ${userUpdate.userId}`)
  logger.info(`update content ${JSON.stringify(userUpdate)}`)

  await updateUser(userUpdate, getUserId(event))

  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(cors({
  credentials: true
}))
