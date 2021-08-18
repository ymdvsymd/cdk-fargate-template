import * as cdk from '@aws-cdk/core';
import { Vpc, SubnetType, SecurityGroup, Peer, Port, InterfaceVpcEndpointAwsService, GatewayVpcEndpointAwsService } from '@aws-cdk/aws-ec2'

export class CdkFargateTemplateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc', {
      cidr: '10.1.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: SubnetType.ISOLATED,
        },
      ]
    });

    const interfaceEndpointSecurityGroup = new SecurityGroup(
      this,
      "InterfaceEndpointSecurityGroup",
      {
        securityGroupName: "InterfaceEndpointSecurityGroup",
        vpc: vpc
      }
    );
    interfaceEndpointSecurityGroup.addIngressRule(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(443)
    );
    vpc.addInterfaceEndpoint('EcrEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: InterfaceVpcEndpointAwsService.ECR
    });
    vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: InterfaceVpcEndpointAwsService.ECR_DOCKER
    });
    vpc.addInterfaceEndpoint('LogsEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS
    });
    vpc.addGatewayEndpoint('S3Endpoint', {
      service: GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnets: vpc.isolatedSubnets
        }
      ]
    });
  }
}
