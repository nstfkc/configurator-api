export interface ServiceContainerInterface {
  make(token: any): any;

  makeAsync(token: any): any;
}
