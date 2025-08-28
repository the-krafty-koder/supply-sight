import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import App from "./App";
import { GET_WAREHOUSES, GET_KPIS } from "./graphql/queries";

const mockWarehouses = [
  {
    code: "AMS",
    name: "Amsterdam Centre",
    city: "Amsterdam",
    country: "Netherlands",
  },
  { code: "PAR", name: "Paris Centre", city: "Paris", country: "France" },
];

const mockKpis = [
  { date: "2025-09-29", stock: 200, demand: 2150 },
  { date: "2025-09-30", stock: 150, demand: 2120 },
];

const mocks = [
  {
    request: { query: GET_WAREHOUSES },
    result: { data: { warehouses: mockWarehouses } },
  },
  {
    request: { query: GET_KPIS, variables: { range: "30d" } },
    result: { data: { kpis: mockKpis } },
  },
];

vi.mock("@apollo/client/react", async () => {
  const actual = await vi.importActual("@apollo/client/react");
  return {
    ...actual,
    useSuspenseQuery: (query: typeof GET_KPIS) => {
      if (query === GET_KPIS) return { data: { kpis: mockKpis } };
      return { data: { warehouses: mockWarehouses } };
    },
  };
});

describe("App", () => {
  it("renders content", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <App />
      </MockedProvider>
    );

    const header = await screen.findByText("SupplySight");
    expect(header).toBeInTheDocument();

    expect(screen.getByText(/Product/)).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("allows changing date range", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <App />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("7d")).toBeInTheDocument();
    });
    const btn = await screen.findByText("7d");
    fireEvent.click(btn);

    expect(btn).toHaveClass("bg-blue-600");
  });
});
