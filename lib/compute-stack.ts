import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as s3 from '@aws-cdk/aws-s3';
import '../lib/string';
import { StackProps } from '../lib/context'

declare type Dependencies = {
  hostedZone: route53.HostedZone,
  certificate: certificatemanager.DnsValidatedCertificate,
  vpc: Vpc
};

export class ComputeStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    private readonly deps: Dependencies,
    private readonly props: StackProps
  ) {
    super(scope, id, props);
    this.createEcs();
  }

  private createEcs(): void {
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc: this.deps.vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512
    });
    const container = taskDef.addContainer(this.props.context.imageRepo.upperCamelCase(), {
      image: ecs.ContainerImage.fromRegistry(this.props.context.imageRepo),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'EcsLogs' })
    });
    container.addPortMappings({
      containerPort: 80
    });

    const fargateService = new ApplicationLoadBalancedFargateService(this, 'EcsSvc', {
      cluster: cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      listenerPort: 443,
      protocol: ApplicationProtocol.HTTPS,
      domainName: this.props.context.domain,
      domainZone: this.deps.hostedZone,
      certificate: this.deps.certificate,
      // FargatePlatformVersion.VERSION1_4だとタスクがPENDINGのまま停止する
      platformVersion: ecs.FargatePlatformVersion.VERSION1_3
    });

    const albBucket = new s3.Bucket(this, 'AlbBucket');
    fargateService.loadBalancer.logAccessLogs(albBucket);

    const scaling = fargateService.service.autoScaleTaskCount({ minCapacity: 2, maxCapacity: 3 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });
  }
}
