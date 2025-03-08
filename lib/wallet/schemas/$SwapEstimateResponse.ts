/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SwapEstimateResponse = {
  properties: {
    data: {
      type: 'all-of',
      description: `Swap quote data`,
      contains: [{
        type: 'QuoteResponseDto',
      }],
      isRequired: true,
    },
  },
} as const;
