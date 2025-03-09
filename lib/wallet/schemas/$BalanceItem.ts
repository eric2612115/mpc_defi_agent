/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BalanceItem = {
  properties: {
    symbol: {
      type: 'string',
      description: `Token symbol`,
      isRequired: true,
    },
    tokenAddress: {
      type: 'string',
      description: `Token address`,
      isRequired: true,
    },
    balance: {
      type: 'string',
      description: `Token balance`,
      isRequired: true,
    },
    formattedBalance: {
      type: 'string',
      description: `Token balance formatted`,
      isRequired: true,
    },
    price: {
      type: 'number',
      description: `Token price in USD`,
      isRequired: true,
    },
    usdValue: {
      type: 'number',
      description: `Token value in USD`,
      isRequired: true,
    },
  },
} as const;
