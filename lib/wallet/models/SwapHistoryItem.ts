/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SwapHistoryItem = {
  /**
   * Transaction hash
   */
  txHash: string;
  /**
   * Input token address
   */
  inputTokenAddress: string;
  /**
   * Input token amount
   */
  inputTokenAmount: string;
  /**
   * Output token address
   */
  outputTokenAddress: string;
  /**
   * Output token amount
   */
  outputTokenAmount: string;
  /**
   * Swap status
   */
  status: SwapHistoryItem.status;
  /**
   * Timestamp of the swap
   */
  timestamp: string;
};
export namespace SwapHistoryItem {
  /**
   * Swap status
   */
  export enum status {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }
}

