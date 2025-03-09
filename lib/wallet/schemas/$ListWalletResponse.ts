/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ListWalletResponse = {
  properties: {
    chain: {
      type: 'string',
    },
    safeWalletList: {
      type: 'array',
      contains: {
        type: 'ListWalletItem',
      },
      isRequired: true,
    },
  },
} as const;
