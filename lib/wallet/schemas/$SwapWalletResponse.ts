/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SwapWalletResponse = {
  properties: {
    chain: {
      type: 'string',
      isRequired: true,
    },
    txHash: {
      type: 'string',
      isRequired: true,
    },
    status: {
      type: 'Enum',
      isRequired: true,
    },
  },
} as const;
