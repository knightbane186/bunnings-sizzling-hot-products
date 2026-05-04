# Design Decisions And Trade-Offs

- Business logic is in the core service layer so the same calculation can be reused by CLI, GraphQL, and tests.
- GraphQL is the backend bridge for the React Native app, while the resolver stays small and delegates calculation to the service.
- No database is included because the assignment provides JSON input files and asks for a focused calculation.
- Input JSON is cached by the server process after the first read to avoid repeated filesystem reads on every GraphQL request.
- No larger state management library is included because the app has one data request and local hook state is enough.
- The CLI lets a reviewer verify the challenge output quickly without opening the mobile app.
- The React Native app is intentionally small, but still includes reusable components, a data hook, loading/error states, and GraphQL integration.

## Future Production Changes

- Replace JSON files with a real data source or API integration.
- Add validation for input data before it reaches the service layer.
- Add structured request logging and production log transport.
- Add monitoring for API uptime, request latency, and failed responses.
- Add a production-safe GraphQL server framework if the API grows.
- Add environment-specific config for local, staging, and production API URLs.
- Add app-level error reporting for React Native runtime errors.
- Add React Query or Apollo Client if caching, retries, polling, or more GraphQL queries are needed.
- Add native e2e tests if this moves beyond a take-home challenge.
