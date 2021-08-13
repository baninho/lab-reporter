import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../models/User';
import { UpdateUserRequest } from '../requests/UpdateUserRequest';

export class UserAccess {
  private readonly docClient: DocumentClient
  private readonly usersTable = process.env.USER_TABLE

  constructor(docClient: DocumentClient) {
    this.docClient = docClient
  }

  async createUser(user: User): Promise<string> {
    await this.docClient.put({
      TableName: this.usersTable,
      Item: user
    }).promise()

    return JSON.stringify({
      userId: user.userId
    })
  }

  async getUserById(userId: string): Promise<User> {
    const result = await this.docClient.query({
      TableName: this.usersTable,
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: {
        ':u': userId
      }
    }).promise()

    return result.Items[0] as User
  }

  async updateUser(testUserUpdate: UpdateUserRequest) {
    throw new Error("Method not implemented." + testUserUpdate.userId);
  }
}