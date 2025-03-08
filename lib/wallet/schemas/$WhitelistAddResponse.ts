/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WhitelistAddResponse = {
  properties: {
    chain: {
      type: 'string',
      isRequired: true,
    },
    safeWalletAddress: {
      type: 'string',
      isRequired: true,
    },
    result: {
      type: 'array',
      contains: {
        type: 'WhitelistAddResultItem',
      },
      isRequired: true,
    },
  },
} as const;
