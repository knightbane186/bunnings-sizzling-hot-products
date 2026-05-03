<div id="top"></div>

## Solution

This solution calculates the Bunnings "Sizzling Hot Products" results from the JSON files in `inputs`. The business rules live in a TypeScript service so the same calculation can be reused by the React Native app, the CLI, and the GraphQL API.

The calculation is separated from transport and UI code, the assumptions are documented, and the main business rules are covered by tests.

## Tech Stack

- Node.js
- TypeScript
- React Native / Expo
- GraphQL
- Jest
- React Native Testing Library

React Native / Expo is used for the mobile interface because the role is mobile-focused. Node.js supports the CLI, tests, and GraphQL API. TypeScript keeps the order, product, and result shapes explicit.

## Packages Used

- `expo`: React Native app runtime and development server.
- `react` and `react-native`: mobile UI.
- `expo-constants`: Expo runtime information used to resolve the local GraphQL host.
- `expo-status-bar`: status bar styling in Expo.
- `graphql`: GraphQL schema execution for the API.
- `typescript`: static typing.
- `jest` and `jest-expo`: backend and frontend test runner.
- `@testing-library/react-native`: React Native component tests.
- `@types/node` and `@types/react`: TypeScript types.

## Why GraphQL

GraphQL gives the React Native app a clear backend API to call. The app fetches the daily and 3-day winners from GraphQL. The API loads the input files, calls the service, and maps the result to the query shape.

Example query:

```graphql
query {
  sizzlingHotProducts {
    daily {
      date
      productId
      productName
      salesCount
    }
    period {
      startDate
      endDate
      productId
      productName
      salesCount
    }
  }
}
```

## Architecture

The project is split by responsibility:

- `src/domain`: shared TypeScript types and date utilities.
- `src/io`: reads `inputs/products.json` and `inputs/orders.json`.
- `src/services`: business logic for deduplication, cancellations, date ranges, and tie-breaking.
- `src/graphql`: GraphQL schema, resolver wiring, and local HTTP server.
- `src/api`: frontend GraphQL client.
- `src/hooks`: React hook for loading, error, refresh, and data state.
- `src/components`: reusable React Native UI components.
- `App.tsx`: React Native screen composition.
- `src/cli.ts`: CLI output for quick challenge review.
- `test/backend`: service and GraphQL tests.
- `test/frontend`: React Native component tests.

## Break It Down

The starting point for the challenge was two JSON files:

- `products.json` contains the product catalogue.
- `orders.json` contains completed and cancelled orders.

From there, the app follows this flow:

1. The input layer reads both JSON files.
2. The domain layer gives the data clear TypeScript shapes.
3. The service layer applies the business rules.
4. The same result is exposed through the CLI, GraphQL API, and React Native app.

The React Native app does not calculate the result itself. It acts as a client that calls the GraphQL API, while the GraphQL API calls the service layer.

```text
inputs JSON
  -> input loader
  -> typed orders/products
  -> service business logic
  -> GraphQL API / CLI
  -> React Native screen
```

## Testing

The tests are split by responsibility:

- Backend service tests cover the business rules directly.
- GraphQL tests check that the API returns the service result in the expected query shape.
- Frontend tests check the React Native loading, success, and error states.

The backend tests cover the main business rules:

- Quantity is ignored.
- Duplicate product entries in one order count once.
- Same customer, product, and day is deduplicated.
- Different customers count separately.
- Same customer and product on different days counts once per day.
- Cancelled orders reverse the original completed sale.
- Alphabetical tie-breaks are applied.
- The sample input produces the expected daily and 3-day winners.

## How to Run

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run the React Native app:

Start the GraphQL API first. The mobile app fetches its product data from this API, so the app screen will show a network error if Expo is started without the API running.

```bash
npm run api
```

Then start Expo in another terminal:

```bash
npm start
```

This opens the Expo development server. From there, the app can be opened with Expo Go, an iOS simulator, or an Android emulator.

The app reads `EXPO_PUBLIC_GRAPHQL_URL` when it is provided. If it is not provided, Expo runtime information is used to call the GraphQL server on the same machine that is running Expo.

For a physical phone, you can still set the URL explicitly:

```bash
EXPO_PUBLIC_GRAPHQL_URL=http://YOUR_LAN_IP:4000/graphql npm start
```

Useful Expo shortcuts:

```bash
npm run ios
npm run android
```

Run the CLI:

```bash
npm run cli
```

Run the CLI with JSON output:

```bash
npm run cli -- --json
```

Test the GraphQL endpoint while `npm run api` is running:

POST a query to `http://127.0.0.1:4000/graphql`:

```bash
curl -X POST http://127.0.0.1:4000/graphql \
  -H 'Content-Type: application/json' \
  --data '{"query":"{ sizzlingHotProducts { daily { date productId productName salesCount } period { startDate endDate productId productName salesCount } } }"}'
```

Build TypeScript explicitly:

```bash
npm run build
```

## Assumptions

- Today's date is fixed as `23/04/2026`.
- The 3-day period is treated as `21/04/2026` to `23/04/2026` inclusive.
- A cancelled order references a previous completed order by `orderId`.
- Quantities are ignored because the challenge says a product sale counts once per order.
- Duplicate product entries in the same order count once.
- Ties are resolved alphabetically by product name.
- Unknown product IDs and entries with non-positive quantities are ignored because the output must resolve to a product from `inputs/products.json`.

## Accessibility

The UI is simple, high contrast, and readable on a mobile screen. To improve accessibility further before production, the next additions would be:

- `accessibilityLabel` values for branded images and retry actions.
- Better screen reader labels for result cards, for example reading the date, product name, and sales count as one useful sentence.
- Dynamic type checks to make sure large text settings do not break card layout.
- Touch target checks for the retry button and any future interactive controls.
- Colour contrast checks against WCAG guidance, especially for secondary grey text and red sales counts.
- Loading and error states that are announced clearly by assistive technologies.

## Production Changes

To take this beyond a take-home challenge, these changes would be next:

- Replace JSON files with a real data source or API integration.
- Add validation for input data before it reaches the service layer.
- Add structured logging around GraphQL requests and data loading failures.
- Add monitoring for API uptime, request latency, and failed responses.
- Add a production-safe GraphQL server framework if the API grows.
- Add environment-specific config for local, staging, and production API URLs.
- Add app-level error reporting for React Native runtime errors.
- Add React Query or Apollo Client if caching, retries, polling, or more GraphQL queries are needed.
- Add CI checks for tests, TypeScript build, and formatting.
- Add end-to-end tests for the main app flow.

## Post Deployment

After deployment, these checks would matter:

- The GraphQL endpoint is reachable from the mobile app.
- The app shows the same expected result as the CLI and backend tests.
- Failed API responses show a clear retry state.
- Logs are available for API errors and input parsing failures.
- Monitoring alerts exist for API downtime or repeated failures.
- The app works on both iOS and Android screen sizes.
- Any new order data still passes the core business rule tests.

## Design Decisions and Trade-offs

- Business logic is in the service layer so the same calculation can be reused by CLI, GraphQL, and tests.
- GraphQL is the backend bridge for the React Native app, while the resolver stays small and delegates calculation to the service.
- No database is included because the assignment provides JSON input files and asks for a focused calculation.
- No larger state management library is included because the app has one data request and local hook state is enough.
- The CLI lets a reviewer verify the challenge output quickly without opening the mobile app.
- The React Native app is intentionally small, but still includes reusable components, a data hook, loading/error states, and GraphQL integration.

## Notes

- Business logic is in `src/services/sizzlingHotProductsService.ts`.
- The GraphQL resolver calls the service and returns the result to the app.
- The CLI calls the same service for quick terminal verification.
- The React Native app uses a small hook for loading, error, refresh, and data state.
- Pull-to-refresh calls the GraphQL API again and replaces the current screen data.
- Jest tests use Given/When/Then style names and are split into backend and frontend files.

## Original Brief

The original challenge brief is kept below for context.

<h1 align="center">
  <br> 
  <img src="readme/logo.png" width="800" alt="Bunnings Take Home Assignment" />
  <br>  <br>
  Sizzling Hot Products
  <br>
</h1>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#brief">Brief</a>
    </li>
    <li><a href="#objective">Objective</a></li>
    <li><a href="#business-rules">Business Rules</a></li>
    <li><a href="#technical-requirements">Technical Requirements</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#assumptions">Assumptions</a></li>
    <li><a href="#expected-outcomes">Expected Outcomes</a></li>
     <li><a href="#extra-points">Extra points</a></li>
  </ol>
</details>

## 📖 Brief

Bunnings is launching a brand-new customer experience to allow customers to view:

- A history of the top sizzling hot product for each day
- The top sizzling hot product over the past 3 days

<p align="right">(<a href="#top">back to top</a>)</p>

## 🎯 Objective

Your assignment is to implement a solution to calculate the sizzling hot products using the business rules defined below.

<p align="right">(<a href="#top">back to top</a>)</p>

## 🚦 Business Rules

1. A product sale should only be counted once per order.
   <br>
   > For example if an order contains a purchase of five hammers it should be counted as a one sale
   > towards the product sales total, not five.
   ```json
   [
     {
       "orderId": "O10",
       "customerId": "C1",
       "entries": [{ "id": "P1", "quantity": 2 }],
       "date": "21/04/2026",
       "status": "completed"
     }
   ]
   ```
2. Multiple orders of the same product by the same customer on the same day should be excluded from the product sales total.
   <br>

   > For example if a customer purchased the same product twice in one day in two separate orders, it should be counted as a one sale towards the product total, not two.

   ```json
   [
     {
       "orderId": "O10",
       "customerId": "C1",
       "entries": [{ "id": "P1", "quantity": 2 }],
       "date": "21/04/2026",
       "status": "completed"
     },
     {
       "orderId": "O11",
       "customerId": "C1",
       "entries": [{ "id": "P1", "quantity": 3 }],
       "date": "21/04/2026",
       "status": "completed"
     }
   ]
   ```

3. Cancelled orders should be credited against the product total.
   <br>

   > For example if a customer cancels an order today that was placed yesterday, that product sale should be removed from the product sales total for that day or period.

   ```json
   [
     {
       "orderId": "O10",
       "customerId": "C1",
       "entries": [...],
       "date": "21/04/2026",
       "status": "completed"
     }, {
       "orderId": "O11",
       "date": "22/04/2026",
       "status": "cancelled"
     }
   ]
   ```

4. In the case of product sales being equal for two or more products, sort the products alphabetically and select the first one in the list.
   <br>
   > For example If a "Hammer" and "BBQ" had similar sales you select "BBQ"

<p align="right">(<a href="#top">back to top</a>)</p>

## 🔧 Technical Requirements

1. Implement the business rules and aggregation in a **backend or service layer** (for example **Node.js** or **.NET**). Other runtimes are fine if you document your choice.
2. Provide a way to view or run the results: **React** (web), **React Native/Expo**, or a **CLI** are all acceptable; other interfaces are fine if you briefly justify them.
3. You may combine technologies not listed above; state your stack and why in your README.
4. The solution should read the JSON sample files from the **inputs** folder.

<p align="right">(<a href="#top">back to top</a>)</p>

## ⚙️ Getting Started

1. **Create your own repository** for your solution. Obtain this assignment by cloning it locally, copying the files into your new repo, or downloading the project as a ZIP. You **cannot fork** this repository or **push** to it, so your submission must live in a separate repo you control.
2. Read the brief and make sure you understand the business rules.
3. Use the sample files in the **inputs** folder for your calculations.
4. Commit your solution back to any publicly accessible repo in GitHub and share the URL back for review.
5. Document instructions on how to install and run your solution in the README.

<p align="right">(<a href="#top">back to top</a>)</p>

## 🔨 Assumptions

1. For calculations assume today's date is 23/04/2026.
2. Document any additional assumptions you have made in your README.

<p align="right">(<a href="#top">back to top</a>)</p>

## 🎓 Expected Outcomes

Based on the inputs in this repo and using the business rules in the README the outcomes should be as follows:

<table>
  <tr>
    <td nowrap><strong>Date or Period</strong></td>
    <td nowrap><strong>Top Sizzling Hot Product</strong></td>
  </tr>
  <tr>
    <td nowrap>21/04/2026</td>
    <td>Ezy Storage 37L Flexi Laundry Basket - White</td>
  </tr>
 <tr>
    <td nowrap>22/04/2026</td>
    <td>Ezy Storage 37L Flexi Laundry Basket - White</td>
  </tr>
   <tr>
    <td nowrap>23/04/2026</td>
    <td>Arlec 160W Crystalline Solar Foldable Charging Kit</td>
  </tr>
    <tr>
    <td nowrap>21/04/2026 - 23/04/2026 </td>
    <td>Ezy Storage 37L Flexi Laundry Basket - White</td>
  </tr>
</table>

<p align="right">(<a href="#top">back to top</a>)</p>

## ✨ Extra points

1. Providing well unit-tested code.
2. Considering design patterns & S.O.L.I.D principles
3. Considering other inputs and edge cases outside the supplied ones.

<p align="right">(<a href="#top">back to top</a>)</p>
