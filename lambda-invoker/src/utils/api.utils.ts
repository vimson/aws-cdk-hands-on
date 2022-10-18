import { APIGatewayProxyResult } from 'aws-lambda';
import { JsonType } from '../types/common.type';

const buildResponse = (requestOrigin: string, data: JsonType): APIGatewayProxyResult => {
  const origin = requestOrigin ?? '';
  const headers: Record<string, string> = origin ? { 'Access-Control-Allow-Origin': origin } : {};

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    headers,
    body: JSON.stringify(data),
  };
  return response;
};

const allowedOrigins = (origins: string): string[] => {
  const origin = origins?.split(',') ?? ['*'];
  return origin;
};

export { buildResponse, allowedOrigins };
