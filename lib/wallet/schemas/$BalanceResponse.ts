/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BalanceResponse = {
  properties: {
    owner: {
      type: 'string',
      description: `Owner address`,
      isRequired: true,
    },
    list: {
      type: 'array',
      contains: {
        type: 'BalanceItem',
      },
      isRequired: true,
    },
  },
} as const;
