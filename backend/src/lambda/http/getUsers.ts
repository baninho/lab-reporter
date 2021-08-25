import { APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logger'
import { getUsers } from '../../main/users'
import { User } from '../../models/User'

const logger = createLogger('getUsers')

/**
* Get all existing users
*/
export const handler = middy( async (): Promise<APIGatewayProxyResult> => {
  logger.info(`getting users`)

  const users: User[] = await getUsers()
  
  return {
    statusCode: 200,
    body: JSON.stringify({users})
  }
  
})

handler.use(cors({
  credentials: true
}))