/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssetsAndPricesResponse = {
  properties: {
    chainId: {
      type: 'number',
      description: `Chain ID`,
      isRequired: true,
    },
    assets: {
      type: 'array',
      contains: {
        type: 'AssetWithPriceItem',
      },
      isRequired: true,
    },
  },
} as const;
