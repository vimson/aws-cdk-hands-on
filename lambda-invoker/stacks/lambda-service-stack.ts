import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { EnvironmentConfig } from '../src/types/common.type';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class LambdaServicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, contextEnv?: EnvironmentConfig) {
    super(scope, id, props);

    const eventSourceQueue = sqs.Queue.fromQueueArn(
      this,
      'LambdaTasks',
      'arn:aws:sqs:eu-west-2:741829461075:LambdaTasks'
    );
    const eventSource = new SqsEventSource(eventSourceQueue);

    // Main Lambda invoker function - SQS event source will trigger this Lambda function
    const lambdaInvoker = new NodejsFunction(this, `LambdaInvoker`, {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'exec',
      entry: path.join(__dirname, `/../src/handlers/lambda-invoker.handler.ts`),
      environment: {
        ...contextEnv,
      },
    });
    lambdaInvoker.addEventSource(eventSource);

    const sendEmail = new NodejsFunction(this, `SendEmail`, {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'exec',
      entry: path.join(__dirname, `/../src/handlers/send-email.handler.ts`),
      environment: {
        ...contextEnv,
      },
    });
    sendEmail.grantInvoke(lambdaInvoker);

    const sendPushNotification = new NodejsFunction(this, `SendPushNotification`, {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'exec',
      entry: path.join(__dirname, `/../src/handlers/send-push-notification.handler.ts`),
      environment: {
        ...contextEnv,
      },
    });
    sendPushNotification.grantInvoke(lambdaInvoker);

    const sendSMS = new NodejsFunction(this, `SendSMS`, {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'exec',
      entry: path.join(__dirname, `/../src/handlers/send-sms.handler.ts`),
      environment: {
        ...contextEnv,
      },
    });
    sendSMS.grantInvoke(lambdaInvoker);

    lambdaInvoker.addEnvironment('SEND_EMAIL_FUNCTION_NAME', sendEmail.functionName);
    lambdaInvoker.addEnvironment('SEND_PUSH_NOTIFICATION_FUNCTION_NAME', sendPushNotification.functionName);
    lambdaInvoker.addEnvironment('SEND_SMS_FUNCTION_NAME', sendSMS.functionName);
  }
}
