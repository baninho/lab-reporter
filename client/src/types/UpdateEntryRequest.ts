import { Attachment } from "./Attachment";

/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateEntryRequest {
  name: string
  groupId: string
  addAttachment?: Attachment
  entryBody?: string
  delKey?: string
  updateGroupId?: string
 }