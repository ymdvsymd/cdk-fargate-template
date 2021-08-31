import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import '../lib/string';
import { Context } from '../lib/context'

export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, context: Context, network: { vpc: Vpc }, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc: network.vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512
    });
    const container = taskDef.addContainer(context.imageRepo.upperCamelCase(), {
      image: ecs.ContainerImage.fromRegistry(context.imageRepo),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'EcsLogs' })
    });
    container.addPortMappings({
      containerPort: 80
    })

    const fargateService = new ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster: cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      listenerPort: 443,
      protocol: ApplicationProtocol.HTTP,
      // domainName: '',
      // domainZone: undefined,
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
