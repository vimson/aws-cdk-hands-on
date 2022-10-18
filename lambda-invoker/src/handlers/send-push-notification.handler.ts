import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const exec = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Push Notification Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Push Notification Context: ${JSON.stringify(context, null, 2)}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      done: true,
    }),
  };
};
