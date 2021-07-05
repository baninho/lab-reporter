export interface UpdateEntryRequest {
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  entryBody?: string
}