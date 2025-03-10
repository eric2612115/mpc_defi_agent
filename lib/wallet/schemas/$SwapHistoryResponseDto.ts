/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SwapHistoryResponseDto = {
  properties: {
    chain: {
      type: 'string',
      description: `Chain ID`,
    },
    safeWalletAddress: {
      type: 'string',
      description: `Safe wallet address`,
      isRequired: true,
    },
    transactions: {
      type: 'array',
      contains: {
        type: 'SwapHistoryItemDto',
      },
      isRequired: true,
    },
  },
} as const;
