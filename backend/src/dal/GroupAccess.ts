import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Group } from '../models/Group'
import { UpdateGroupRequest } from '../requests/UpdateGroupRequest'
import { createDynamoDBClient } from '../utils/utils'

export class GroupAccess {
  private readonly docClient: DocumentClient = createDynamoDBClient()
  private readonly groupsTable = process.env.GROUPS_TABLE
  
  async putGroup(group: Group): Promise<Group> {
    await this.docClient.put({
      TableName: this.groupsTable,
      Item: group
    }).promise()
    
    return group
  }
  
  async getGroups(): Promise<Group[]> {
    const result = await this.docClient.scan({
      TableName: this.groupsTable
    }).promise()
    
    return result.Items as Group[]
  }

  async updateGroup(update: UpdateGroupRequest) {
    const UpdateExpression = `SET #N=:n`
    const ExpressionAttributeValues = {
      ':n': update.name
    }
    const ExpressionAttributeNames = {
      '#N': 'name' 
    }

    const updateParams = {
      TableName: this.groupsTable,
      Key: {
        groupId: update.groupId
      },
      ExpressionAttributeNames,
      UpdateExpression,
      ExpressionAttributeValues,
      ReturnValues:'ALL_NEW'
    }

    try {
      return await this.docClient.update(updateParams).promise()
    } catch (e) {
      throw(e)
    }
  }
}