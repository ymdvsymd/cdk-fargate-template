import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import { ContainerImage, Cluster, FargatePlatformVersion } from "@aws-cdk/aws-ecs";

export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, network: { vpc: Vpc }, props?: cdk.StackProps) {
    super(scope, id, props);

    const albFargateService = new ApplicationLoadBalancedFargateService(
      this,
      "AlbFargateService",
      {
        cluster: new Cluster(this, "EcsCluster", { vpc: network.vpc }),
        taskImageOptions: {
          image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        },
        platformVersion: FargatePlatformVersion.VERSION1_3
      }
    );
  }
}
