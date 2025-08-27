import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

import "./index.css";
import App from "./App.tsx";
import { HttpLink } from "@apollo/client/link/http";

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${import.meta.env.VITE_API_URL}`,
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
