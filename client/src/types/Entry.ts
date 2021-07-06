export interface Entry {
  entryId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrls: string[]
  body?: string
}
