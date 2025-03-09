/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WhitelistAddDto = {
  properties: {
    chain: {
      type: 'string',
      isRequired: true,
    },
    safeWalletAddress: {
      type: 'string',
      isRequired: true,
    },
    whitelistSignatures: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    tokenAddresses: {
      type: 'array',
      contains: {
        type: 'TokenAddressDto',
      },
      isRequired: true,
    },
  },
} as const;
