export class ResourceName {
  constructor(private readonly systemName: string, private readonly systemEnv: string) {
    this.systemName = systemName;
    this.systemEnv = systemEnv;
  }

  stack(name: string = ''): string {
    const stackName = !!name ? `${name}-stack` : 'stack'
    return this.basicName(stackName);
  }

  vpc(name: string = ''): string {
    const vpcName = !!name ? `${name}-vpc` : 'vpc'
    return this.basicName(vpcName);
  }

  subnet(name: string): string {
    return this.basicName(`${name}-subnet`);
  }

  endpoint(name: string): string {
    return this.basicName(`${name}-endpoint`)
  }

  private basicName(name: string): string {
    return `${this.systemName}-${this.systemEnv}-${name}`.toLowerCase();
  }
}
