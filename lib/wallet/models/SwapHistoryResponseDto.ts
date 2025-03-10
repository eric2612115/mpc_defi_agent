/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SwapHistoryItemDto } from './SwapHistoryItemDto';
export type SwapHistoryResponseDto = {
  /**
   * Chain ID
   */
  chain?: string;
  /**
   * Safe wallet address
   */
  safeWalletAddress: string;
  /**
   * List of transactions
   */
  transactions: Array<SwapHistoryItemDto>;
};

