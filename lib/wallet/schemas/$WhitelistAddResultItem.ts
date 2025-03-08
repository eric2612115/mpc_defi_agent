/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WhitelistAddResultItem = {
  properties: {
    tokenAddress: {
      type: 'string',
      isRequired: true,
    },
    symbol: {
      type: 'string',
      isRequired: true,
    },
    status: {
      type: 'Enum',
      isRequired: true,
    },
    error: {
      type: 'string',
      description: `Error message if status is failed`,
    },
  },
} as const;
