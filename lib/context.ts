import '../lib/string';

export class Context {
  constructor(private self: { tryGetContext: (key: string) => any }) {
  }

  get stackNamePrefix(): string {
    return this.name.upperCamelCase() + this.env.upperCamelCase();
  }

  get name(): string {
    return this.self.tryGetContext('name');
  }

  get env(): string {
    return this.self.tryGetContext('env');
  }

  get domain(): string {
    return this.self.tryGetContext('domain');
  }

  get imageRepo(): string {
    return this.self.tryGetContext('domain');
  }
}
