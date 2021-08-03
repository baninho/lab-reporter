import { Attachment } from "./Attachment";

export interface Entry {
  userId: string
  entryId: string
  createdAt: string
  groupId: string
  name: string
  attachments: Attachment[]
  body?: string
}

export class Entry implements Entry {
  constructor() {
    this.userId = ''
    this.entryId = ''
    this.createdAt = ''
    this.groupId = ''
    this.name = ''
    this.attachments = []
    this.body = ''
  }
}