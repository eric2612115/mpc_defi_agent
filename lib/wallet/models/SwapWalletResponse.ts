/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SwapWalletResponse = {
  chain: string;
  txHash: string;
  status: SwapWalletResponse.status;
};
export namespace SwapWalletResponse {
  export enum status {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }
}

