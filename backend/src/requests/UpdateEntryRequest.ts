import { Attachment } from "../models/Attachment";

/**
 * Fields in a request to update a single entry item.
 */
 export interface UpdateEntryRequest {
  name: string
  groupId: string
  addAttachment?: Attachment
  entryBody?: string
  delKey?: string
  updateGroupId?: string
}