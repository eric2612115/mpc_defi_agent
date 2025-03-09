/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BalanceItem } from './BalanceItem';
export type BalanceResponse = {
  /**
   * Owner address
   */
  owner: string;
  /**
   * List of tokens in portfolio
   */
  list: Array<BalanceItem>;
};

