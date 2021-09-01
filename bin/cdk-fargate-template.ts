#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DomainStack } from '../lib/domain-stack';
import { NetworkStack } from '../lib/network-stack';
import { ComputeStack } from '../lib/compute-stack';
import { Context } from '../lib/context'
import { CertStack } from '../lib/cert-stack';

const app = new cdk.App();
const context = new Context(app.node);
const props = {
  env: {
    region: 'ap-northeast-1'
  },
  context: context
};

/* 最初に単独で実行する必要あり */
const domain = new DomainStack(app, `${context.stackPrefix}Domain`, props);

const cert = new CertStack(app, `${context.stackPrefix}Cert`, { hostedZone: domain.hostedZone }, props)
const network = new NetworkStack(app, `${context.stackPrefix}Network`, props);
new ComputeStack(app, `${context.stackPrefix}Compute`, { hostedZone: domain.hostedZone, certificate: cert.certificate, vpc: network.vpc }, props);
