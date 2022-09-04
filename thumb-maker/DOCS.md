# AWS CDK project

## CDK installation

```shell
cdk init app --language typescript
```

## This is a blank project for TypeScript development with CDK

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Note

All AWS CDK v2 deployments use dedicated AWS resources to hold data during deployment, so your AWS account and region must be bootstrapped to create these resources before you can deploy. If you haven't already bootstrapped, issue:

```shell
cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile evan_vimson
cdk bootstrap aws://741829461075/eu-west-2 --profile evan_vimson
```

## CDK deploy by speciying the profile

```shell

npx aws-cdk synth --profile evan_vimson my-stack
cdk destroy CdkStack --profile evan_vimson

cdk deploy --profile evan_vimson

npx jest src/tests/imageresizer.test.ts --watch

```

## Development steps

- Initing the CK app
- Syntesizing
- Bootstrapping
- Deploying

## References

- <https://docs.aws.amazon.com/cdk/api/v2/>
- <https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html>
- <https://github.com/dmccarthy-dev/serverless-typescript-jest-boilerplate/blob/master/test/hello-2.spec.ts>

## Javascript Lambda function

```javascript
const imageResizerLamba = new lambda.Function(this, "ImageResizerLambda", {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: "image-resizer.handler",
  functionName: "ImageResizerLambda",
  reservedConcurrentExecutions: 1,
  code: lambda.Code.fromAsset("src/handlers"),
  timeout: cdk.Duration.seconds(900),
});
```
