import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import { StackProps } from './context';

export class DomainStack extends cdk.Stack {
  public readonly hostedZone: route53.HostedZone;

  constructor(scope: cdk.Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: props.context.domain
    });
  }
}
