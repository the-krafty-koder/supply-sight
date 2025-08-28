import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { MockedProvider } from "@apollo/client/testing/react";
import ProductsSegment from "../components/ProductsSegment";
import { GET_PRODUCTS } from "../graphql/queries";
import { FiltersProvider } from "../context/FiltersContext";
import type { Product, Warehouse } from "../types";

vi.mock("@apollo/client/react", () => {
  const actual = vi.importActual("@apollo/client/react");
  return {
    ...actual,
    useSuspenseQuery: () => {
      return { data: { products: mockProducts } };
    },
  };
});

const mockWarehouses: Warehouse[] = [
  { code: "W1", name: "Warehouse 1", city: "Paris", country: "France" },
];

const mockProducts: Product[] = [
  {
    id: "P1",
    name: "Steel Bolts",
    sku: "SKU-001",
    warehouse: "W1",
    stock: 100,
    demand: 50,
  },
  {
    id: "P2",
    name: "Steel Nuts",
    sku: "SKU-002",
    warehouse: "W2",
    stock: 80,
    demand: 120,
  },
];

const mocks = [
  {
    request: {
      query: GET_PRODUCTS,
      variables: {
        offset: 1,
        limit: 10,
        search: null,
        status: null,
        warehouse: null,
      },
    },
    result: { data: { products: mockProducts } },
  },
];

describe("ProductsSegment", () => {
  it("renders products", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <FiltersProvider>
          <Suspense fallback={<p>Loading products...</p>}>
            <ProductsSegment warehouses={mockWarehouses} />
          </Suspense>
        </FiltersProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Steel Bolts")).toBeInTheDocument();
      expect(screen.getByText("Steel Nuts")).toBeInTheDocument();
    });

    expect(screen.getByText("W1")).toBeInTheDocument();
  });
});
