import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { EnvironmentConfig } from '../src/types/common.type';
import { allowedOrigins } from '../src/utils/api.utils';

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, contextEnv?: EnvironmentConfig) {
    super(scope, id, props);

    const helloWorldGetFunction = new NodejsFunction(this, 'helloWorldGetFunction', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'get',
      entry: path.join(__dirname, `/../src/handlers/hello-world.handler.ts`),
      environment: {
        ...contextEnv,
      },
    });

    const helloWorldPostFunction = new NodejsFunction(this, 'helloWorldPostFunction', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'post',
      entry: path.join(__dirname, `/../src/handlers/hello-world.handler.ts`),
      environment: {
        ...contextEnv,
      },
    });

    const restApi = new RestApi(this, 'HelloWorldApi', {
      restApiName: 'HelloWorldApi',
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins(contextEnv?.ALLOWED_HOSTS),
        allowMethods: ['OPTIONS', 'GET', 'POST'],
        disableCache: true,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
          'X-Amz-User-Agent',
          'Access-Control-Allow-Origin',
        ],
      },
    });

    const apiResource = restApi.root.addResource('hello-world');
    apiResource.addMethod('GET', new LambdaIntegration(helloWorldGetFunction));
    apiResource.addMethod('POST', new LambdaIntegration(helloWorldPostFunction), {});
  }
}
