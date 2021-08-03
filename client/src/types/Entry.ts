import { Attachment } from "./Attachment";

export interface Entry {
  userId: string
  entryId: string
  createdAt: string
  groupId: string
  name: string
  dueDate: string
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
    this.dueDate = ''
    this.attachments = []
    this.body = ''
  }
}