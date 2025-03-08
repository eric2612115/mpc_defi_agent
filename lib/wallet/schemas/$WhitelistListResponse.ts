/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WhitelistListResponse = {
  properties: {
    chain: {
      type: 'string',
      isRequired: true,
    },
    safeWalletAddress: {
      type: 'string',
      isRequired: true,
    },
    list: {
      type: 'array',
      contains: {
        type: 'WhitelistListItem',
      },
      isRequired: true,
    },
  },
} as const;
