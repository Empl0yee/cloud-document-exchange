import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3 = new S3Client({ region: "eu-central-1" });
const Bucket = process.env.BUCKET;
const Key = "files/test-file-1/v1";

const post = await createPresignedPost(s3, {
  Bucket,
  Key,
  Expires: 300,
  Conditions: [["content-length-range", 0, 10 * 1024 * 1024]], // 10MB max limit
});
console.log("POST:", JSON.stringify(post, null, 2));

const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key }), { expiresIn: 300 });
console.log("GET:", url);