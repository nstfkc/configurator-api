import { ServiceContainerInterface } from './service-container.interface';

export abstract class LocatorService {
  private static container: ServiceContainerInterface;

  static setContainer(container: ServiceContainerInterface) {
    this.container = container;
  }

  static make(token: any) {
    if (!this.container) {
      throw new Error('Missing Container for LocatorService');
    }
    return this.container.make(token);
  }

  static async makeAsync(token: any) {
    if (!this.container) {
      throw new Error('Missing Container for LocatorService');
    }
    return this.container.makeAsync(token);
  }
}
