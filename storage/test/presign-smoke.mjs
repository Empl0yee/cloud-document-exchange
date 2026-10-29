import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import fs from "fs";

const s3 = new S3Client({ region: "eu-central-1" });
const Bucket = process.env.BUCKET;
const Key = "files/test-file-1/v1";

const { url, fields } = await createPresignedPost(s3, {
  Bucket,
  Key,
  Expires: 300,
});

const formData = new FormData();
Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
formData.append("file", new Blob([fs.readFileSync("hello.txt")]));

const response = await fetch(url, {
  method: "POST",
  body: formData,
});

console.log("Status Code:", response.status);
if (response.status === 204 || response.ok) {
  console.log("УСПЕХ: Файл успешно загружен в S3!");
} else {
  console.log("Ошибка загрузки:", await response.text());
}
