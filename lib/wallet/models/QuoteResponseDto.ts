/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type QuoteResponseDto = {
  /**
   * Deprecated field
   */
  deprecated?: string | null;
  /**
   * Trace ID for debugging
   */
  traceId?: string | null;
  /**
   * Input token addresses
   */
  inTokens: Array<string>;
  /**
   * Output token addresses
   */
  outTokens: Array<string>;
  /**
   * Input token amounts
   */
  inAmounts: Array<string>;
  /**
   * Output token amounts
   */
  outAmounts: Array<string>;
  /**
   * Gas estimate for the swap
   */
  gasEstimate: number;
  /**
   * Data gas estimate for the swap
   */
  dataGasEstimate: number;
  /**
   * Gas price in gwei
   */
  gweiPerGas: number;
  /**
   * Gas estimate value in native currency
   */
  gasEstimateValue: number;
  /**
   * Input token values in USD
   */
  inValues: Array<number>;
  /**
   * Output token values in USD
   */
  outValues: Array<number>;
  /**
   * Net output value in USD
   */
  netOutValue: number;
  /**
   * Price impact percentage
   */
  priceImpact?: number | null;
  /**
   * Percentage difference
   */
  percentDiff: number;
  /**
   * Partner fee percentage
   */
  partnerFeePercent?: number;
  /**
   * Path ID
   */
  pathId?: string | null;
  /**
   * Path visualization data
   */
  pathViz?: Record<string, any> | null;
  /**
   * Path visualization image
   */
  pathVizImage?: string | null;
  /**
   * Block number
   */
  blockNumber: number;
};

