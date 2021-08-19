import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../../utils/utils'
import { getUserById } from '../../main/users'
import { User } from '../../models/User'

const logger = createLogger('getUserById')

/**
 * Get user by ID
 */
export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const userIdRequest = event.pathParameters.userId

  logger.info(`getting user ${userId}`)
  try {
    const user: User = await getUserById(userIdRequest)

    // For now only return their own user info
    // TODO: admin access, public access
    const permission: boolean = userId === user.userId
    const body: string = permission ? JSON.stringify(user) : 'No permission'
    const statusCode = permission ? 200 : 403

    return {
      statusCode,
      body
    }
  } catch (e) {
    throw (e)
  }
})

handler.use(cors({
  credentials: true
}))