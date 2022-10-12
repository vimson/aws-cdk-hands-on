import { APIGatewayProxyResult } from 'aws-lambda';

export type JsonType =
  | string
  | number
  | boolean
  | null
  | JsonType[]
  | { [key: string]: JsonType }
  | { [key: number]: APIGatewayProxyResult };

export type EnvironmentConfig = Record<string, any>;
