import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { EntryItem } from '../models/EntryItem'
import { UpdateEntryRequest } from '../requests/UpdateEntryRequest'
import { createDynamoDBClient } from '../utils/utils'

interface EntryKey {
  groupId?: string
  createdAt: string
}

export class EntryAccess {
  // TODO: refactor to match UserAccess
  // should accept database client object to facilitate testing
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly entriesTable = process.env.ENTRY_TABLE,
    private readonly entryIdIndex = process.env.ENTRY_ID_INDEX
  ) {}

  async createEntry(entryItem: EntryItem) {
    await this.docClient.put({
      TableName: this.entriesTable,
      Item: entryItem
    }).promise()
  }

  async getEntriesByUser(userId: string): Promise<EntryItem[]> {
    const result = await this.docClient.query({
      TableName: this.entriesTable,
      KeyConditionExpression: 'groupId = :groupId',
      ExpressionAttributeValues: {
        ':groupId': userId // TODO: use groupId
      },
      ScanIndexForward: false
    }).promise()

    return result.Items as EntryItem[]
  }

  async getEntryById(entryId: string): Promise<EntryItem> {
    const result = await this.docClient.query({
      TableName : this.entriesTable,
      IndexName : this.entryIdIndex,
      KeyConditionExpression: 'entryId = :entryId',
      ExpressionAttributeValues: {
          ':entryId': entryId
      }
    }).promise()

    return result.Items[0] as EntryItem
  }

  async deleteEntry(entryId: string, userId: string) {
    const key = await this.getEntryKeyById(entryId)
    
    key.groupId = userId
  
    const params = {
      TableName: this.entriesTable,
      Key: key
    }
    
    await this.docClient.delete(params).promise()
  }

  async updateEntry(updatedEntry: UpdateEntryRequest, entryId: string) {
    // TODO: clean up this hack
    const entry = await this.getEntryById(entryId)
    const key = {
      createdAt: entry.createdAt,
      groupId: updatedEntry.groupId
    }
    
    if (updatedEntry.addAttachment) {
      entry.attachments.push(updatedEntry.addAttachment)
    } else if (updatedEntry.delKey) {
      entry.attachments = entry.attachments.filter((att) => {return att.key !== updatedEntry.delKey})
    }

    if (updatedEntry.updateGroupId && updatedEntry.updateGroupId != entry.groupId) {
      entry.groupId = updatedEntry.updateGroupId
      entry.body = updatedEntry.entryBody

      await this.createEntry(entry)
      await this.deleteEntry(entry.entryId, entry.userId)

      return
    }

    try {
      await this.docClient.update({
        TableName: this.entriesTable,
        Key: key,
        ExpressionAttributeNames: { '#N': 'name' },
        UpdateExpression: `set #N = :n, attachments=:a${updatedEntry.entryBody ? ', body=:b' : ''}`,
        ExpressionAttributeValues:{
          ':n':updatedEntry.name,
          ':a':entry.attachments,
          ':b':updatedEntry.entryBody
        },
        ReturnValues:'UPDATED_NEW'
      }).promise()
    } catch (e) {
      throw e
    }
  }

  private async getEntryKeyById(entryId: string): Promise<EntryKey> {
    const result = await this.docClient.query({
      TableName : this.entriesTable,
      IndexName : this.entryIdIndex,
      KeyConditionExpression: 'entryId = :entryId',
      ExpressionAttributeValues: {
          ':entryId': entryId
      }
    }).promise()

    return {
      'createdAt': result.Items[0].createdAt
    }
  }
}