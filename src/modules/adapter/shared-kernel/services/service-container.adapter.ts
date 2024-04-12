import { ServiceContainerInterface } from '@Shared/services';

export class ServiceContainerAdapter implements ServiceContainerInterface {
  constructor(private readonly _make: (token: any) => any, private readonly _makeAsync: (token: any) => Promise<any>) {}

  make(token: any) {
    return this._make(token);
  }

  async makeAsync(token: any) {
    return this._makeAsync(token);
  }
}
