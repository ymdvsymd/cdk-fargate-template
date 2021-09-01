import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import '../lib/string';
import { StackProps } from '../lib/context'

declare type Dependencies = {
  hostedZone: route53.HostedZone
};

export class CertStack extends cdk.Stack {
  readonly certificate: certificatemanager.DnsValidatedCertificate;

  constructor(
    scope: cdk.Construct,
    id: string,
    private readonly deps: Dependencies,
    private readonly props: StackProps
  ) {
    super(scope, id, props);

    this.certificate = new certificatemanager.DnsValidatedCertificate(this, 'Certificate', {
      // サービスを増やして、サブドメインで動かすならワイルドカード証明書を取得すること
      // `*.${props.context.domain}`
      domainName: `${props.context.domain}`,
      hostedZone: deps.hostedZone,
      validationMethod: certificatemanager.ValidationMethod.DNS
    });
  }
}
