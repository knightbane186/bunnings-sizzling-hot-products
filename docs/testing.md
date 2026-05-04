# Testing

## Automated Checks

Run the full local check set before opening or merging a PR:

```bash
npm run check
```

Individual commands:

```bash
npm run lint
npm run typecheck
npm test
```

## Jest Coverage

- `test/backend/sizzling-hot-products.backend.test.ts`: service-level business rules.
- `test/backend/graphql.backend.test.ts`: GraphQL query shape and expected response.
- `test/frontend/App.test.tsx`: React Native loading, success, and error states.

The backend tests cover:

- Quantity is ignored.
- Duplicate product entries in one order count once.
- Same customer, product, and day is deduplicated.
- Different customers count separately.
- Same customer and product on different days counts once per day.
- Cancelled orders reverse the original completed sale.
- Alphabetical tie-breaks are applied.
- The sample input produces the expected daily and 3-day winners.

## E2E Testing

An end-to-end test is a useful next step, but it is not included in this small take-home project.

For a React Native app, Detox would be the stronger native-app option. Playwright would only be useful if the app is also run through Expo Web, because Playwright is browser-focused rather than native mobile-focused.
