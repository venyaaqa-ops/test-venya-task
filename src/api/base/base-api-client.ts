import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { ApiResult, ExpectedResponse } from './types.js';

export abstract class BaseApiClient {
  private readonly baseUrl = 'https://stats-api.dln.trade/api/';

  private readonly defaultHeaders = {
    'Content-Type': 'application/json-patch+json',
    Accept: 'application/json',
  };

  constructor(protected readonly playwrightRequest: APIRequestContext) {}

  protected get<TResponse>(
    url: string,
    expected?: ExpectedResponse
  ) 
  {
    return this.request<TResponse, undefined>('GET', url, undefined, expected);
  }

  protected post<TResponse, TRequest>(
    url: string,
    data: TRequest,
    expected?: ExpectedResponse,
  ) 
  {
    return this.request<TResponse, TRequest>('POST', url, data, expected);
  }

  protected put<TResponse, TRequest>(
    url: string,
    data: TRequest,
    expected?: ExpectedResponse,
  ) {
    return this.request<TResponse, TRequest>('PUT', url, data, expected);
  }

  protected patch<TResponse, TRequest>(
    url: string,
    data: TRequest,
    expected?: ExpectedResponse,
  ) {
    return this.request<TResponse, TRequest>('PATCH', url, data, expected);
  }

  protected delete<TResponse>(url: string, expected?: ExpectedResponse) {
    return this.request<TResponse, undefined>('DELETE', url, undefined, expected);
  }

  protected async request<TResponse, TRequest>(
    method: string,
    url: string,
    data: TRequest,
    expected?: ExpectedResponse,
  ): Promise<ApiResult<TResponse, TRequest>> {
    const requestUrl = new URL(url, this.baseUrl).toString();

    const response = await this.playwrightRequest.fetch(requestUrl, {
      data,
      headers: this.defaultHeaders,
      method,
      failOnStatusCode: false,
    });

    return this.handleResponse<TResponse, TRequest>(response, data, expected);
  }

  private async handleResponse<TResponse, TRequest>(
    response: APIResponse,
    requestBody: TRequest,
    expected?: ExpectedResponse,
  ): Promise<ApiResult<TResponse, TRequest>> {
    const responseBody = await this.readBody(response);

    if (expected?.status !== undefined) {
      expect(response.status(), `${response.url()}: unexpected HTTP status`).toBe(expected.status);
    } else {
      expect(
        response.ok(),
        `${response.url()}: expected 2xx, received ${response.status()}`,
      ).toBe(true);
    }

    if (expected?.error !== undefined) {
      expect(responseBody, `${response.url()}: unexpected error details`).toMatchObject(expected.error);
    }

    return {
      response,
      responseBody: responseBody as TResponse,
      requestBody,
    };
  }

  private async readBody(response: APIResponse): Promise<unknown> {
    const text = await response.text();

    if (text.length === 0) {
      return undefined;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return text;
      }
      throw error;
    }
  }
}
