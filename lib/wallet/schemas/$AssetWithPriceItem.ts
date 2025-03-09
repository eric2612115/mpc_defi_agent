/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssetWithPriceItem = {
  properties: {
    symbol: {
      type: 'string',
      description: `Token symbol`,
      isRequired: true,
    },
    name: {
      type: 'string',
      description: `Token name`,
      isRequired: true,
    },
    decimals: {
      type: 'number',
      description: `Token decimals`,
      isRequired: true,
    },
    price: {
      type: 'number',
      description: `Token price in USD`,
      isRequired: true,
    },
    address: {
      type: 'string',
      description: `Token address`,
      isRequired: true,
    },
    assetId: {
      type: 'string',
      description: `Asset ID`,
      isRequired: true,
    },
    assetType: {
      type: 'string',
      description: `Asset type`,
      isRequired: true,
    },
    protocolId: {
      type: 'string',
      description: `Protocol ID`,
      isRequired: true,
    },
    isRebasing: {
      type: 'boolean',
      description: `Is rebasing token`,
      isRequired: true,
    },
  },
} as const;
