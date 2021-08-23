import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../models/User';
import { UpdateUserRequest } from '../requests/UpdateUserRequest';

export class UserAccess {
  private readonly docClient: DocumentClient
  private readonly usersTable = process.env.USERS_TABLE
  
  constructor(docClient: DocumentClient) {
    this.docClient = docClient
  }
  
  async createUser(user: User): Promise<User> {
    await this.docClient.put({
      TableName: this.usersTable,
      Item: user
    }).promise()
    
    return user
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
  
  async updateUser(userUpdate: UpdateUserRequest) {
    const updateExpr: string[] = []
    const exprAttrVals: any = {}
    const exprAttrNames: any = {}
    
    if (userUpdate.name) {
      updateExpr.push('#N = :n')
      exprAttrVals[':n'] = userUpdate.name
      exprAttrNames['#N'] = 'name'
    }
    
    if (userUpdate.newGroups) {
      updateExpr.push('groups = list_append(groups, :ng)')
      exprAttrVals[':ng'] = userUpdate.newGroups
    }
    
    const params: DocumentClient.UpdateItemInput = {
      TableName: this.usersTable,
      Key: {userId: userUpdate.userId},
      UpdateExpression: 'SET ' + updateExpr.join(','),
      ExpressionAttributeValues: exprAttrVals,
      ReturnValues:'UPDATED_NEW'
    }
    
    if (Object.keys(exprAttrNames).length > 0) {
      params.ExpressionAttributeNames = exprAttrNames
    }

    console.log('updateexpr: ' + params.UpdateExpression)
    console.log('exprattrvals: ' + params.ExpressionAttributeValues)
    
    try {
      await this.docClient.update(params).promise()
    } catch (e) {
      throw e
    }
  }
}