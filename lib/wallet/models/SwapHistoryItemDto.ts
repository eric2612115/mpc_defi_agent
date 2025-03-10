/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SwapHistoryItemDto = {
  /**
   * Transaction hash
   */
  hash: string;
  /**
   * Transaction type
   */
  type: SwapHistoryItemDto.type;
  /**
   * Sender address
   */
  from: string;
  /**
   * Recipient address
   */
  to: string;
  /**
   * Transaction amount in token units
   */
  amount: string;
  /**
   * Transaction value in USD
   */
  value?: string;
  /**
   * Transaction timestamp
   */
  timestamp: string;
  /**
   * Transaction status
   */
  status: SwapHistoryItemDto.status;
  /**
   * Blockchain network
   */
  chain?: string;
  /**
   * Additional transaction details
   */
  details?: string;
  /**
   * Chain ID for determining explorer
   */
  chainIndex?: string;
};
export namespace SwapHistoryItemDto {
  /**
   * Transaction type
   */
  export enum type {
    SWAP = 'Swap',
    SEND = 'Send',
    RECEIVE = 'Receive',
  }
  /**
   * Transaction status
   */
  export enum status {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    SUCCESS = 'success',
  }
}

