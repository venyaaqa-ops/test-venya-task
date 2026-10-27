# deBridge Orders API Tests

TypeScript and Playwright API tests for deBridge orders.

## Coverage

- Fetches orders from `POST /Orders/filteredList`.
- Requests pages with `skip` and `take: 25`.
- Filters orders by a wallet address.
- Fetches order details with `GET /Orders/{orderId}`.
- Verifies that the wallet address exists in the details response.

## Structure

- `BaseApiClient` contains shared HTTP methods and response handling.
- `OrdersClient` implements the orders endpoints.
- `tests/fixtures/api.fixture.ts` provides `OrdersClient` to tests.
- `tests/orders.spec.ts` contains wallet-details test-script.

The API base URL is `https://stats-api.dln.trade/api/`.

## Run

```sh
npm ci
npm run typecheck
npm test
```

## Note

The wallet has orders on many pages. The wallet test checks the first filtered
page only, so it stays fast and avoids public API rate limits. A complete scan
of every filtered order should be run separately with a delay between requests.
