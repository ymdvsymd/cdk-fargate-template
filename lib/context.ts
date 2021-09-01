import * as cdk from '@aws-cdk/core';
import '../lib/string';

export class Context {
  constructor(private self: { tryGetContext: (key: string) => any }) {
  }

  get appName(): string {
    return this.self.tryGetContext('appName');
  }

  get env(): string {
    return this.self.tryGetContext('env');
  }

  get domain(): string {
    return this.self.tryGetContext('domain');
  }

  get imageRepo(): string {
    return this.self.tryGetContext('imageRepo');
  }

  get stackPrefix(): string {
    return this.appName.upperCamelCase() + this.env.upperCamelCase();
  }

  get subDomain(): string {
    return `${this.appName}.${this.domain}`;
  }
}

export interface StackProps extends cdk.StackProps {
  context: Context;
}
