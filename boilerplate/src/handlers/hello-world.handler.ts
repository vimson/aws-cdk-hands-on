import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from '../utils/api.utils';

export const get = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const responseData = {
    done: true,
    time: new Date().toISOString(),
    method: 'GET',
    request: event,
  };
  return buildResponse(event?.headers?.origin ?? '', responseData);
};

export const post = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const responseData = {
    done: true,
    time: new Date().toISOString(),
    method: 'GET',
    request: event,
  };

  return buildResponse(event?.headers?.origin ?? '', responseData);
};
