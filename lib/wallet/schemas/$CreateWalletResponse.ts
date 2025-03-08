/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateWalletResponse = {
  properties: {
    chain: {
      type: 'string',
      isRequired: true,
    },
    safeWalletAddress: {
      type: 'string',
      isRequired: true,
    },
    guardAddress: {
      type: 'string',
      isRequired: true,
    },
    txHash: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
