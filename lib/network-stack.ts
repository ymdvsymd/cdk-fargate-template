import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class NetworkStack extends cdk.Stack {
  vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', {
      cidr: '10.1.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: ec2.SubnetType.ISOLATED
        }
      ]
    });

    const interfaceEndpointSecurityGroup = new ec2.SecurityGroup(this, "InterfaceEndpointSecurityGroup", { vpc: this.vpc });
    interfaceEndpointSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(443)
    );
    this.vpc.addInterfaceEndpoint('EcrEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: ec2.InterfaceVpcEndpointAwsService.ECR
    });
    this.vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER
    });
    this.vpc.addInterfaceEndpoint('LogsEndpoint', {
      securityGroups: [interfaceEndpointSecurityGroup],
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS
    });
    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnets: this.vpc.isolatedSubnets
        }
      ]
    });
  }
}
