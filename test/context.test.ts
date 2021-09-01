import * as cdk from '@aws-cdk/core';
import { Context } from '../lib/context'

const app = new cdk.App({
  context: {
    'appName': 'app',
    'env': 'test',
    'domain': 'foobar.com',
    'imageRepo': 'foo/bar'
  }
});

test('context', () => {
  const target = new Context(app.node);
  expect(target.stackPrefix).toEqual('AppTest');
});
