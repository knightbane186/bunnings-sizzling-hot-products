# Assumptions

- Today's date is fixed as `23/04/2026`.
- The 3-day period is treated as `21/04/2026` to `23/04/2026` inclusive.
- A cancelled order references a previous completed order by `orderId`.
- Quantities are ignored because the challenge says a product sale counts once per order.
- Duplicate product entries in the same order count once.
- Same customer, product, and day is counted once across multiple completed orders.
- Ties are resolved alphabetically by product name.
- Unknown product IDs and entries with non-positive quantities are ignored because the output must resolve to a product from `inputs/products.json`.
- The local GraphQL API must be running before the mobile app can load product results.
