import { S3Access } from "../dal/S3Access"

const s3access = new S3Access()

export async function getUploadUrl(todoId: string): Promise<string> {
  return s3access.getUploadUrl(todoId)
}

export async function deleteObject(todoId: string) {
  await s3access.deleteObject(todoId)
}