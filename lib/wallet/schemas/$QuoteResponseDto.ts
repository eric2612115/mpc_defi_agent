/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $QuoteResponseDto = {
  properties: {
    deprecated: {
      type: 'string',
      description: `Deprecated field`,
      isNullable: true,
    },
    traceId: {
      type: 'string',
      description: `Trace ID for debugging`,
      isNullable: true,
    },
    inTokens: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    outTokens: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    inAmounts: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    outAmounts: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    gasEstimate: {
      type: 'number',
      description: `Gas estimate for the swap`,
      isRequired: true,
    },
    dataGasEstimate: {
      type: 'number',
      description: `Data gas estimate for the swap`,
      isRequired: true,
    },
    gweiPerGas: {
      type: 'number',
      description: `Gas price in gwei`,
      isRequired: true,
    },
    gasEstimateValue: {
      type: 'number',
      description: `Gas estimate value in native currency`,
      isRequired: true,
    },
    inValues: {
      type: 'array',
      contains: {
        type: 'number',
      },
      isRequired: true,
    },
    outValues: {
      type: 'array',
      contains: {
        type: 'number',
      },
      isRequired: true,
    },
    netOutValue: {
      type: 'number',
      description: `Net output value in USD`,
      isRequired: true,
    },
    priceImpact: {
      type: 'number',
      description: `Price impact percentage`,
      isNullable: true,
    },
    percentDiff: {
      type: 'number',
      description: `Percentage difference`,
      isRequired: true,
    },
    partnerFeePercent: {
      type: 'number',
      description: `Partner fee percentage`,
    },
    pathId: {
      type: 'string',
      description: `Path ID`,
      isNullable: true,
    },
    pathViz: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isNullable: true,
    },
    pathVizImage: {
      type: 'string',
      description: `Path visualization image`,
      isNullable: true,
    },
    blockNumber: {
      type: 'number',
      description: `Block number`,
      isRequired: true,
    },
  },
} as const;
