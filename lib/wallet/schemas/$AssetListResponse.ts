/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssetListResponse = {
  properties: {
    chainId: {
      type: 'number',
      description: `Chain ID`,
      isRequired: true,
    },
    data: {
      type: 'array',
      contains: {
        type: 'AssetInfo',
      },
      isRequired: true,
    },
  },
} as const;
