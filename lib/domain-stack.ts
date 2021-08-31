import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import { Context } from './context';

export class DomainStack extends cdk.Stack {
  public readonly hostedZone: route53.HostedZone;

  constructor(scope: cdk.Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);

    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: context.domain
    });
  }
}
