export interface RequestCtx {
  readonly id: string;
  toObject?: () => Record<string, any>;
}
