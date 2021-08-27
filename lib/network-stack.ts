import * as cdk from '@aws-cdk/core';
import { Vpc, SubnetType, SecurityGroup, Peer, Port, InterfaceVpcEndpointAwsService, GatewayVpcEndpointAwsService } from '@aws-cdk/aws-ec2';

export class NetworkStack extends cdk.Stack {
  vpc: Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, 'Vpc', {
      cidr: '10.1.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: SubnetType.ISOLATED
        }
      ]
    });

    const interfaceEndpointSecurityGroup = new SecurityGroup(this, "InterfaceEndpointSecurityGroup", { vpc: this.vpc });
    interfaceEndpointSecurityGroup.addIngressRule(
      Peer.ipv4(this.vpc.vpcCidrBlock),
      Port.tcp(443)
    );
    this.vpc.addInterfaceEndpoint('EcrEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: InterfaceVpcEndpointAwsService.ECR
    });
    this.vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: InterfaceVpcEndpointAwsService.ECR_DOCKER
    });
    this.vpc.addInterfaceEndpoint('LogsEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS
    });
    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnets: this.vpc.isolatedSubnets
        }
      ]
    });
  }
}
