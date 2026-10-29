import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "eu-central-1" });
const Bucket = process.env.BUCKET;
const Key = "files/test-file-1/v1";

const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key }), { expiresIn: 300 });

const response = await fetch(url);
const text = await response.text();
console.log("УСПЕХ! Содержимое скачанного файла:", text);
