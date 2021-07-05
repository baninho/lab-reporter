import * as AWS  from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('S3Access')

export class S3Access{
  constructor(
    private readonly bucketName = process.env.ATTACHMENTS_BUCKET,
    private readonly s3 = new AWS.S3({signatureVersion: 'v4'}),
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async deleteObject(entryId: string){
    logger.info(`deleting S3 object ${entryId}`)
    
    try {
      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: entryId
      }).promise()
    } catch (e) {
      logger.error(`Error deleting S3 item`, { message: e.message })
    }
  }

  async getUploadUrl(entryId: string): Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: `${entryId}`,
      Expires: parseInt(this.urlExpiration)
    })
  }
}