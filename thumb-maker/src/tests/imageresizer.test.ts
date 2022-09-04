import fs from "fs";
import path from "path";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { generateThumbs, cleanUpThumbs } from "../handlers/image-resizer";
import { s3EventInput } from "./data/inputs.data";
import * as utils from "../tests/utils/general.utils";
import sharp from "sharp";

const thumbSizes = [
  {
    width: 100,
    height: 100,
  },
  {
    width: 200,
    height: 200,
  },
  {
    width: 400,
    height: 400,
  },
  {
    width: 800,
    height: 800,
  },
];

jest.mock("../helpers/s3.helper", () => ({
  getS3ObjectContents: jest.fn(
    async (file: string, bucket: string): Promise<Buffer> => {
      return await utils.readFile(
        path.resolve(__dirname, "./data/files/tell_no_one.jpeg")
      );
    }
  ),

  putObject: jest.fn(
    async (bucket: string, file: string, data: Buffer): Promise<any> => {
      fs.writeFileSync(
        path.resolve(__dirname, "./data/files/thumbs/" + file),
        data
      );
      return {} as any;
    }
  ),
}));

describe("Teting ImageResizer", () => {
  test("Resizing and saving image & crosschecking the widtha nd height of the resized image", async () => {
    const event = s3EventInput as unknown as APIGatewayEvent;
    const context = {} as Context;
    const res: APIGatewayProxyResult = await generateThumbs(event, context);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(`{"done":true}`);

    // Check the files are resized properly using the metadata of resized images
    thumbSizes.forEach(async (size) => {
      const imgMetaData = await sharp(
        path.resolve(
          __dirname,
          `./data/files/thumbs/resized-${size.width}X${size.height}_tell_no_one.jpeg`
        )
      ).metadata();
      expect(imgMetaData.width).toBe(size.width);
      expect(imgMetaData.height).toBe(size.width);
    });
  });
});
