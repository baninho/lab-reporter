/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateEntryRequest {
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  entryBody?: string
}