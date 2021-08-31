import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import '../lib/string';
import { Context } from '../lib/context'

declare type Dependencies = {
  context: Context,
  vpc: Vpc,
  hostedZone: route53.HostedZone
};

export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, deps: Dependencies, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificate = new certificatemanager.DnsValidatedCertificate(this, 'Certificate', {
      domainName: `*.${deps.context.subDomain}`,
      hostedZone: deps.hostedZone,
      validationMethod: certificatemanager.ValidationMethod.DNS
    });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc: deps.vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512
    });
    const container = taskDef.addContainer(deps.context.imageRepo.upperCamelCase(), {
      image: ecs.ContainerImage.fromRegistry(deps.context.imageRepo),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'EcsLogs' })
    });
    container.addPortMappings({
      containerPort: 80
    });

    const fargateService = new ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster: cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      listenerPort: 443,
      protocol: ApplicationProtocol.HTTPS,
      domainName: deps.context.subDomain,
      domainZone: deps.hostedZone,
      certificate: certificate,
      // FargatePlatformVersion.VERSION1_4だとタスクがPENDINGのまま停止する
      platformVersion: ecs.FargatePlatformVersion.VERSION1_3
    });

    const scaling = fargateService.service.autoScaleTaskCount({ minCapacity: 2, maxCapacity: 3 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });
  }
}
