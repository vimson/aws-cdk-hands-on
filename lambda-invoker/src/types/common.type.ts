import { Key } from 'aws-cdk-lib/aws-kms';
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

export type LambdaMapping = {
  [key: string]: string;
};
