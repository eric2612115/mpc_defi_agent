/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SwapWalletDto = {
  properties: {
    chain: {
      type: 'string',
      isRequired: true,
    },
    safeWalletAddress: {
      type: 'string',
      isRequired: true,
    },
    inputTokenAddress: {
      type: 'string',
      isRequired: true,
    },
    inputTokenAmount: {
      type: 'string',
      isRequired: true,
    },
    outputTokenAddress: {
      type: 'string',
      isRequired: true,
    },
    outputTokenMinAmount: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
