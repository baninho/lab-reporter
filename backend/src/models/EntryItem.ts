import { Attachment } from "./Attachment";

export interface EntryItem {
  userId: string
  entryId: string
  createdAt: string
  groupId: string
  name: string
  attachments: Attachment[]
  body?: string
}
