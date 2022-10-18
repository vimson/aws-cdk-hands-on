# AWS CDK - Invoking Lambda from another Lambda function

We have a use case in our project like we have one SQS queue and we need to execute around 80 different microservices or Lambda functions based on that. When we think about sns fanout to sqs using filters, yes that is the best method as per the practices. In that case we need to update all the SQS producers to SNS and need to create diffent SQS for each service or using filters and it seems to be hectic work.

So we used the same SQS queue, One invoker function and Lambda invoker calls the individual Lambda functions.

The following is the code for invoking the other Lambda functions by our main Lambda function. The below code is just for illustration only

```typescript
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
    Payload: fromUtf8(JSON.stringify({ payload: 'some data' })),
  });
  response = await client.send(command);
}
```

The whole example implementation in AWS CDK you can see here in this repo.
