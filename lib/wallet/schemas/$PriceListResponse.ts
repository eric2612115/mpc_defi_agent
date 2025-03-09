/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceListResponse = {
  properties: {
    chainId: {
      type: 'number',
      description: `Chain ID`,
      isRequired: true,
    },
    data: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
    },
  },
} as const;
