/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SwapHistoryItem = {
  properties: {
    txHash: {
      type: 'string',
      description: `Transaction hash`,
      isRequired: true,
    },
    inputTokenAddress: {
      type: 'string',
      description: `Input token address`,
      isRequired: true,
    },
    inputTokenAmount: {
      type: 'string',
      description: `Input token amount`,
      isRequired: true,
    },
    outputTokenAddress: {
      type: 'string',
      description: `Output token address`,
      isRequired: true,
    },
    outputTokenAmount: {
      type: 'string',
      description: `Output token amount`,
      isRequired: true,
    },
    status: {
      type: 'Enum',
      isRequired: true,
    },
    timestamp: {
      type: 'string',
      description: `Timestamp of the swap`,
      isRequired: true,
    },
  },
} as const;
