import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import fs from "fs";

const getClient = (): S3Client => {
  const s3 = new S3Client({
    region: "eu-west-2",
  });
  return s3;
};

const streamToString = (stream: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: any = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

const getS3ObjectContents = (file: string, bucket: string): Promise<Buffer> => {
  const s3 = getClient();
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: file,
  });

  return new Promise(async (resolve, reject) => {
    try {
      const response = await s3.send(getObjectCommand);
      const imgBody = await streamToString(response.Body);
      resolve(imgBody);
    } catch (err) {
      reject(err);
    }
  });
};

const putObject = (
  bucket: string,
  file: string,
  data: Buffer
): Promise<PutObjectCommandOutput> => {
  const s3 = getClient();
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: file,
    Body: data,
  });

  return s3.send(putObjectCommand);
};

const removeObject = (
  bucket: string,
  file: string
): Promise<DeleteObjectCommandOutput> => {
  const s3 = getClient();
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: file,
  });
  return s3.send(deleteObjectCommand);
};

export { getS3ObjectContents, putObject, removeObject };
