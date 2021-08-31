#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DomainStack } from '../lib/domain-stack';
import { NetworkStack } from '../lib/network-stack';
import { ComputeStack } from '../lib/compute-stack';
import { Context } from '../lib/context'

const app = new cdk.App();
const context = new Context(app.node);

// DomainStackのみ単独で実行する必要あり
const domain = new DomainStack(app, `${context.stackPrefix}Domain`, context);

const network = new NetworkStack(app, `${context.stackPrefix}Network`);
new ComputeStack(app, `${context.stackPrefix}Compute`, { context, vpc: network.vpc, hostedZone: domain.hostedZone });
