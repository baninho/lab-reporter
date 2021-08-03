import { S3Access } from "../dal/S3Access"
import { EntryItem } from "../models/EntryItem"
import { getEntryById } from "./entries"

const s3access = new S3Access()

export async function getUploadUrl(entryId: string): Promise<string> {
  return s3access.getUploadUrl(entryId)
}

export async function deleteObject(s3key: string) {
  await s3access.deleteObject(s3key)
}

export async function deleteAllObjects(entryId:string) {
  const entry: EntryItem = await getEntryById(entryId)

  for (const attachment of entry.attachments) {
    await deleteObject(attachment.key)
  }

  await deleteObject(entryId)
}