import { Context, SQSEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { fromUtf8 } from '@aws-sdk/util-utf8-node';
import { LambdaMapping } from '../types/common.type';

export const exec = async (event: SQSEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Lambda Invoker Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Lambda Invoker Context: ${JSON.stringify(context, null, 2)}`);
  console.log(process.env);

  const module = (event?.Records[0]?.messageAttributes?.Module?.stringValue as string) ?? '';
  const lambdaMapping: LambdaMapping = {
    SMS: process.env.SEND_SMS_FUNCTION_NAME ?? '',
    EMAIL: process.env.SEND_EMAIL_FUNCTION_NAME ?? '',
    PUSH_NOTIFICATION: process.env.SEND_PUSH_NOTIFICATION_FUNCTION_NAME ?? '',
  };

  let response;
  if (lambdaMapping[module]) {
    const client = new LambdaClient({ region: 'eu-west-2' });
    const command = new InvokeCommand({
      FunctionName: lambdaMapping[module],
      InvocationType: 'Event',
      Payload: fromUtf8(JSON.stringify({ hello: 'world' })),
    });
    response = await client.send(command);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      done: true,
      response: response,
    }),
  };
};
