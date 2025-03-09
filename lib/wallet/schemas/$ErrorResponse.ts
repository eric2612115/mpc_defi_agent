/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ErrorResponse = {
  properties: {
    status: {
      type: 'number',
      description: `HTTP Status code`,
      isRequired: true,
    },
    message: {
      type: 'string',
      description: `Error message`,
      isRequired: true,
    },
    error: {
      type: 'string',
      description: `Detailed error message`,
      isRequired: true,
    },
  },
} as const;
