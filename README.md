# Supply sight

- The app is built using React + Tailwind for the frontend, and the mock server is built using node.js, express and apollo graphql.

# Setup Instructions

Clone the project folder at https://github.com/the-krafty-koder/supply-sight
Navigate to the folder to install dependencies and run the app.

# Backend

1. Navigate to the backend folder
2. Run `npm install`
3. Run `npm start` to start the server.

# Frontend

1. Navigate to the frontend folder
2. Run `npm install`
3. Run `npm start` to start the server.
4. Navigate to `http://localhost:5173` to use the app.

# Design

## Tech stack

Backend - Apollo GraphQL, Node.js, Express
Frontend - React, TailwindCSS, Vite, Rechart, Vitest

- I chose Apollo as the GraphQL client because of its state management and caching features and its declarative data fetching.

## Design Decisions

### App structure

- The app is structured as a set of components
  1. <Products /> for managing the products table.
  2. <Filter/> for rendering the filters.
  3. <KPICard /> representing each KPI Card.
  4. <Header> for the header tab.
  5. <FiltersContext> to manage filters globally
- 2 "composite" components <ProductsSegment> and <KPISegment> manage each section of the app, the products (products + filters) and the kpis ( kpi cards + line chart).

### Components

1. State management & caching.

- I used React Context to manage filter and pagination state globally. Instead of lifting all state to <App /> and passing it down, <FiltersContext /> allows both <Products /> and <Filters /> to access and update filter state—like search, warehouse, and pagination—directly.
- I avoided using a third-party state library like Redux because Apollo Client already provides built-in state management, and the app’s requirements aren’t complex enough to justify using something like Redux.
- Apollo also automatically caches query results, reducing unnecessary network requests

2. Data fetching and updating

- I used useSuspenseQuery with ErrorBoundary to fetch data and handle loading, error, and success states cleanly. While it was trickier to mock in tests, it worked well in practice, providing smooth transitions when filtering products or changing KPI date ranges.

- I used Apollo’s useMutation hook to modify and refetch data, enabling quick updates on the frontend and keeping the UI in sync with backend changes.
- KPI data is paginated when fetched, defaults to the last 30 days. Products data is paginated as well, defaults to first 10 rows.

3. Performance improvements.

- I memoized the <ProductsSegment> component, so that changes to KPI date range dont cause unnecessary rerenders.
- I also debounced the search input to prevent excessive queries to the backend while typing.
- I used `useCallback` on certain functions as well to prevent redefinition if dependencies did not change.
- Use of `useSuspenseQuery` also helped smoothen transitions when filtering products or moving between KPI date ranges.
- Data is paginated at the backend, ensuring efficient queries and minimizing frontend overhead.

4. Styling

- Tailwind CSS was used to style because it is quick to work with. Major problem was verbosity as some classnames became too long.
- I explored using ShadCN components (e.g., Drawer) but ultimately decided against them, as most components didn’t fully meet the app’s requirements.
- Recharts library provided rich and dynamic charts that integrate well with React so I used it to build the line chart.

5. Mock server

- The mock server is bare bones as it's main purpose is to provide data for the frontend, which is the main focus for the assignment. I've not included request validation, api rate limiting, testing or a database because of time limitations. Data is provided via a `data.json` file that is loaded into memory and modified from there.

### Potential improvements

I would add the following if I had more time.

1. Responsive design
   I would use tailwind to build mobile first, responsive designs to support devices with different viewports.
2. Accessibility
   I would include keyboard navigation for viewing the products, eg using arrow keys to move to next and previous pages.
3. E2E tests
   I would add end-to-end tests using Cypress to make the code more robust.
