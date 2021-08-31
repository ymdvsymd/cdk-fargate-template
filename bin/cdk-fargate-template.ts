#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NetworkStack } from '../lib/network-stack';
import { ComputeStack } from '../lib/compute-stack';
import { Context } from '../lib/context'

const app = new cdk.App();
const context = new Context(app.node);
const network = new NetworkStack(app, `${context.stackNamePrefix}Network`);
new ComputeStack(app, `${context.stackNamePrefix}Compute`, context, { vpc: network.vpc });
