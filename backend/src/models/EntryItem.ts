export interface EntryItem {
  userId: string
  entryId: string
  createdAt: string
  groupId: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
