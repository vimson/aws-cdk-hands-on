import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class ThumbResizerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Image and Thumnail bucket resource creation
    const imageBucket = new s3.Bucket(this, "images", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    const thumImageBucket = new s3.Bucket(this, "thumb-images", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    // Resize image Lambda function creation & configuration
    const imageResizerLamba = new NodejsFunction(this, "ImageResizerLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "generateThumbs",
      functionName: "ImageResizerLambda",
      reservedConcurrentExecutions: 1,
      entry: path.resolve(`./src/handlers/image-resizer.ts`),
      timeout: cdk.Duration.seconds(900),
      environment: {
        IMG_BUCKET_NAME: imageBucket.bucketName,
        THUM_IMG_BUCKET_NAME: thumImageBucket.bucketName,
      },
      bundling: {
        nodeModules: ["sharp"],
        forceDockerBundling: true,
      },
    });

    const cleanUpThumbsLamba = new NodejsFunction(this, "ThumbCleanerLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "cleanUpThumbs",
      functionName: "ThumbCleanerLambda",
      reservedConcurrentExecutions: 1,
      entry: path.resolve(`./src/handlers/image-resizer.ts`),
      timeout: cdk.Duration.seconds(900),
      environment: {
        IMG_BUCKET_NAME: imageBucket.bucketName,
        THUM_IMG_BUCKET_NAME: thumImageBucket.bucketName,
      },
      bundling: {
        nodeModules: ["sharp"],
        forceDockerBundling: true,
      },
    });

    imageBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(imageResizerLamba)
    );
    imageBucket.addEventNotification(
      s3.EventType.OBJECT_REMOVED,
      new s3n.LambdaDestination(cleanUpThumbsLamba)
    );

    // Cloud formation outputs
    new cdk.CfnOutput(this, "ImageBucketName", {
      value: imageBucket.bucketName,
    });
    new cdk.CfnOutput(this, "ImageBucketArn", {
      value: imageBucket.bucketArn,
    });

    new cdk.CfnOutput(this, "ThumbImageBucketName", {
      value: thumImageBucket.bucketName,
    });
    new cdk.CfnOutput(this, "ThumbImageBucketArn", {
      value: thumImageBucket.bucketArn,
    });
  }
}
