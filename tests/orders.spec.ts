import { test, expect } from "./fixtures/api.fixture.js";

const containsWalletAddress = (
  value: unknown,
  walletAddress: string,
): boolean => {
  if (value === walletAddress) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) => containsWalletAddress(item, walletAddress));
  }

  if (value !== null && typeof value === "object") {
    return Object.values(value).some((item) =>
      containsWalletAddress(item, walletAddress),
    );
  }

  return false;
};

test("First filtered orders page contains the wallet address in details", async ({
  ordersClient,
}) => {
  const walletAddress = "BUnGokFzA1wu8vb6adHfyhnNvCxaVt6QyPNmmUNWPwET";
  const pageSize = 25;

  const { responseBody: ordersPage, requestBody } =
    await ordersClient.getOrdersPage(1, pageSize, walletAddress);

  // This test checks only the first page to stay fast and stable.
  // The wallet has orders on many pages. Checking every order would send hundreds
  // of requests to the public API and can cause an HTTP 429 rate-limit response.
  // A full scan should run separately with a delay between requests. The optimal
  // delay is unknown because the API does not document its limit.
  expect(requestBody.filter).toBe(walletAddress);
  expect(requestBody.skip).toBe(0);
  expect(requestBody.take).toBe(pageSize);
  expect(ordersPage.totalCount).toBeGreaterThan(0);
  expect(ordersPage.orders).toHaveLength(
    Math.min(pageSize, ordersPage.totalCount),
  );

  for (const order of ordersPage.orders) {
    const { responseBody: orderDetails } = await ordersClient.getOrderDetails(
      order.orderId.stringValue,
    );

    expect(
      containsWalletAddress(orderDetails, walletAddress),
      `Expected order ${order.orderId.stringValue} details to contain the wallet address`,
    ).toBe(true);
  }
});
