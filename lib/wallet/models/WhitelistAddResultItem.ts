/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WhitelistAddResultItem = {
  tokenAddress: string;
  symbol: string;
  /**
   * Status of the operation
   */
  status: WhitelistAddResultItem.status;
  /**
   * Error message if status is failed
   */
  error?: string;
};
export namespace WhitelistAddResultItem {
  /**
   * Status of the operation
   */
  export enum status {
    ADDED = 'added',
    ALREADY_WHITELISTED = 'already_whitelisted',
    FAILED = 'failed',
    REMOVED = 'removed',
    NOT_WHITELISTED = 'not_whitelisted',
  }
}

