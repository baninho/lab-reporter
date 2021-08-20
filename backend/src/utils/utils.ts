import * as AWS  from 'aws-sdk'
import * as AWSXRay  from 'aws-xray-sdk'
import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

const XAWS = AWSXRay.captureAWS(AWS)

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  if (process.env.JEST_WORKER_ID) {
    const isTest = process.env.JEST_WORKER_ID;
    const config = {
      convertEmptyValues: true,
      ...(isTest && {
        endpoint: 'localhost:8000',
        sslEnabled: false,
        region: 'local-env',
      }),
    };

    return new AWS.DynamoDB.DocumentClient(config);
  }

  return new XAWS.DynamoDB.DocumentClient()
}