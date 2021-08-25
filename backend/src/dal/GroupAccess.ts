import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Group } from '../models/Group'
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
}