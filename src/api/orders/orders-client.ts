import { BaseApiClient } from '../base/base-api-client.js';

export type OrdersListResponse = {
  totalCount: number;
  orders: {
    orderId: {
      stringValue: string;
    };
    creationTimestamp: number;
    state: string;
    tradeType: string;
  }[];
};

export type OrdersListRequest = {
  giveChainIds: number[];
  takeChainIds: number[];
  filter?: string;
  skip: number;
  take: number;
  filterMode: string;
};

export type OrderDetailsResponse = Record<string, unknown>;

export class OrdersClient extends BaseApiClient {
  public getOrdersPage(page = 1, pageSize = 25, filter?: string) {
    return this.getOrders({
      filter,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  public getOrders(data: Partial<OrdersListRequest> = {}) {
    const request: OrdersListRequest = {
      giveChainIds: [],
      takeChainIds: [],
      skip: 0,
      take: 25,
      filterMode: 'Mixed',
      ...data,
    };
    return this.post<OrdersListResponse, OrdersListRequest>(
      'Orders/filteredList',
      request,
    );
  }

  public getOrderDetails(orderId: string) {
    return this.get<OrderDetailsResponse>(`Orders/${orderId}`);
  }
}
