import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  getS3ObjectContents,
  putObject,
  removeObject,
} from "../helpers/s3.helper";
import sharp from "sharp";

type ImageSizeConfig = {
  width: number;
  height: number;
  name: string;
};

const getSizes = function (): Array<ImageSizeConfig> {
  return [
    {
      width: 100,
      height: 100,
      name: "thumb-100X100",
    },
    {
      width: 200,
      height: 200,
      name: "thumb-200X200",
    },
    {
      width: 400,
      height: 400,
      name: "thumb-400X400",
    },
    {
      width: 800,
      height: 800,
      name: "thumb-800X800",
    },
  ];
};

export const generateThumbs = async (
  event: APIGatewayEvent | any,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const thumbSizes = getSizes();
  const bucket = event?.Records[0]?.s3?.bucket?.name;
  const filename = event?.Records[0]?.s3?.object?.key;
  const imageContents = await getS3ObjectContents(filename, bucket);

  const destnBucketName =
    process.env.THUM_IMG_BUCKET_NAME ??
    "cdkstack-thumbimages6e5380fb-nmlujjrcwjvp";

  if (!destnBucketName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ done: true, message: "No bucket name found" }),
    };
  }

  const fileTransform = sharp(imageContents);
  try {
    await Promise.all(
      thumbSizes.map(async (size) => {
        return putObject(
          destnBucketName,
          `resized-${size.width}X${size.height}_${filename}`,
          await fileTransform.resize(size.width, size.height).toBuffer()
        );
      })
    );
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ done: true }),
  };
};

export const cleanUpThumbs = async (
  event: APIGatewayEvent | any,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const destnBucketName =
    process.env.THUM_IMG_BUCKET_NAME ??
    "cdkstack-thumbimages6e5380fb-nmlujjrcwjvp";
  const fileName = event?.Records[0]?.s3?.object?.key;
  const thumbSizes = getSizes();

  await Promise.all(
    thumbSizes.map(async (size) => {
      return removeObject(
        destnBucketName,
        `resized-${size.width}X${size.height}_${fileName}`
      );
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ done: true }),
  };
};
