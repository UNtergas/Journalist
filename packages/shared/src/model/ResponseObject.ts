export type ResponseObject<K extends string, T> = {
  [P in K]: T;
};

export const API = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
} as const

export type APIResponse = typeof API[keyof typeof API]