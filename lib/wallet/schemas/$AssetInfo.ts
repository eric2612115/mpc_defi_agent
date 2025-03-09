/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssetInfo = {
  properties: {
    address: {
      type: 'string',
      description: `Token address`,
      isRequired: true,
    },
    token: {
      type: 'all-of',
      description: `Token information`,
      contains: [{
        type: 'TokenInfo',
      }],
      isRequired: true,
    },
  },
} as const;
