/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenAddressDto } from './TokenAddressDto';
export type WhitelistAddDto = {
  chain: string;
  safeWalletAddress: string;
  whitelistSignatures: Array<string>;
  /**
   * Array of token addresses with symbols
   */
  tokenAddresses: Array<TokenAddressDto>;
};

