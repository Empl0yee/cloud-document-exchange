import { Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

@Injectable()
export class StorageService {
  private s3 = new S3Client({ region: process.env.AWS_REGION || 'eu-central-1' });
  private Bucket = process.env.BUCKET || 'cloudfiles-oleh-2026';

  async createUploadUrl(p: { fileId: string; version: number; maxBytes: number; contentType: string }) {
    const Key = `files/${p.fileId}/v${p.version}`;
    const post = await createPresignedPost(this.s3, {
      Bucket: this.Bucket,
      Key,
      Expires: 300,
      Conditions: [['content-length-range', 0, p.maxBytes]],
    });

    return {
      url: post.url,
      fields: post.fields,
      key: Key,
      expiresAt: new Date(Date.now() + 300 * 1000),
    };
  }

  async confirmUpload(key: string) {
    return {
      size: 1024,
      etag: '"mock-etag"',
      lastModified: new Date(),
    };
  }

  async createDownloadUrl(p: { fileId: string; version: number }) {
    const Key = `files/${p.fileId}/v${p.version}`;
    const command = new GetObjectCommand({ Bucket: this.Bucket, Key });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 300 });

    return {
      url,
      expiresAt: new Date(Date.now() + 300 * 1000),
    };
  }

  async listVersions(fileId: string) {
    return [];
  }
}
