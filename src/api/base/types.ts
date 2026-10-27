import type { APIResponse } from '@playwright/test';

export type ExpectedResponse = {
  status?: number;
  error?: Record<string, unknown>;
};

export type ApiResult<TResponse, TRequest> = {
  response: APIResponse;
  responseBody: TResponse;
  requestBody: TRequest;
};
