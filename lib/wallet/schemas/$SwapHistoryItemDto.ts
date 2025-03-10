/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SwapHistoryItemDto = {
  properties: {
    hash: {
      type: 'string',
      description: `Transaction hash`,
      isRequired: true,
    },
    type: {
      type: 'Enum',
      isRequired: true,
    },
    from: {
      type: 'string',
      description: `Sender address`,
      isRequired: true,
    },
    to: {
      type: 'string',
      description: `Recipient address`,
      isRequired: true,
    },
    amount: {
      type: 'string',
      description: `Transaction amount in token units`,
      isRequired: true,
    },
    value: {
      type: 'string',
      description: `Transaction value in USD`,
    },
    timestamp: {
      type: 'string',
      description: `Transaction timestamp`,
      isRequired: true,
    },
    status: {
      type: 'Enum',
      isRequired: true,
    },
    chain: {
      type: 'string',
      description: `Blockchain network`,
    },
    details: {
      type: 'string',
      description: `Additional transaction details`,
    },
    chainIndex: {
      type: 'string',
      description: `Chain ID for determining explorer`,
    },
  },
} as const;
