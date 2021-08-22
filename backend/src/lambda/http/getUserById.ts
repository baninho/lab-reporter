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
  const userIdRequest = event.headers.userid
  
  logger.info(`request user ${JSON.stringify(event.headers)} for ${userId}`)
  
  // For now only return their own user info
  // TODO: admin access, public access
  if (userId !== userIdRequest) {
    return {
      statusCode: 403,
      body: 'No permission'
    }
  }
  
  logger.info(`getting user ${userIdRequest}`)
  
  const user: User = await getUserById(userIdRequest)
  logger.info(`got user ${JSON.stringify(user)}`)
  
  return {
    statusCode: 200,
    body: JSON.stringify({user})
  }
  
})

handler.use(cors({
  credentials: true
}))