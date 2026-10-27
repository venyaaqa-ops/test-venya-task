import { test as base } from '@playwright/test';
import { OrdersClient } from '../../src/api/orders/orders-client.js';

export const test = base.extend<{ ordersClient: OrdersClient }>({
  ordersClient: async ({ request }, use) => {
    await use(new OrdersClient(request));
  },
});

export { expect } from '@playwright/test';
