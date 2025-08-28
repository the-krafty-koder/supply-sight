import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Products from "./Products";
import { FiltersProvider } from "../context/FiltersContext";
import type { Product } from "../types";

const mockProducts: Product[] = [
  {
    id: "P1",
    name: "Steel Bolts",
    sku: "SKU-001",
    warehouse: "W1",
    stock: 100,
    demand: 30,
  },
  {
    id: "P3",
    name: "Copper Washers",
    sku: "SKU-003",
    warehouse: "W3",
    stock: 10,
    demand: 55,
  },
];

describe("Products", () => {
  it("renders product table with correct data and status pills", () => {
    const onProductClick = vi.fn();

    render(
      <FiltersProvider>
        <Products products={mockProducts} onProductClick={onProductClick} />
      </FiltersProvider>
    );

    ["Product", "SKU", "Warehouse", "Stock", "Demand", "Status"].forEach(
      (header) => {
        expect(screen.getByText(header)).toBeInTheDocument();
      }
    );

    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(product.sku)).toBeInTheDocument();
      expect(screen.getByText(product.warehouse)).toBeInTheDocument();
      expect(screen.getByText(product.stock.toString())).toBeInTheDocument();
      expect(screen.getByText(product.demand.toString())).toBeInTheDocument();
    });

    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("handles product row clicks", () => {
    const onProductClick = vi.fn();

    render(
      <FiltersProvider>
        <Products products={mockProducts} onProductClick={onProductClick} />
      </FiltersProvider>
    );

    fireEvent.click(screen.getByText("Steel Bolts"));
    expect(onProductClick).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("handles pagination buttons", () => {
    const onProductClick = vi.fn();

    render(
      <FiltersProvider>
        <Products products={mockProducts} onProductClick={onProductClick} />
      </FiltersProvider>
    );

    const prevButton = screen.getByRole("button", { name: /Previous/i });
    const nextButton = screen.getByRole("button", { name: /Next/i });

    expect(prevButton).toBeDisabled();

    expect(nextButton).toBeDisabled();
  });
});
