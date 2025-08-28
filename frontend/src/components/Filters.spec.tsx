import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Filters from "../components/Filters";
import { FiltersProvider } from "../context/FiltersContext";

const mockWarehouses = [
  { code: "PAR", name: "Paris Centre", city: "Paris", country: "France" },
  {
    code: "MAR",
    name: "Marseille Centre",
    city: "Marseille",
    country: "France",
  },
];

describe("Filters", () => {
  it("renders inputs correctly", () => {
    render(
      <FiltersProvider>
        <Filters warehouses={mockWarehouses} />
      </FiltersProvider>
    );

    const searchInput = screen.getByPlaceholderText(
      /Search by name, SKU, or ID/i
    );
    expect(searchInput).toBeInTheDocument();

    const warehouseSelect = screen.getByDisplayValue(/All Warehouses/i);
    expect(warehouseSelect).toBeInTheDocument();
    expect(screen.getByText(/Paris Centre - PAR/i)).toBeInTheDocument();
    expect(screen.getByText(/Marseille Centre - MAR/i)).toBeInTheDocument();

    const statusSelect = screen.getByDisplayValue(/All Statuses/i);
    expect(statusSelect).toBeInTheDocument();
    expect(screen.getByText(/Healthy/i)).toBeInTheDocument();
    expect(screen.getByText(/Low/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical/i)).toBeInTheDocument();
  });

  it("search input updates correctly", () => {
    render(
      <FiltersProvider>
        <Filters warehouses={mockWarehouses} />
      </FiltersProvider>
    );

    const searchInput = screen.getByPlaceholderText(
      /Search by name, SKU, or ID/i
    );
    fireEvent.change(searchInput, { target: { value: "Steel Bolts" } });
    expect((searchInput as HTMLInputElement).value).toBe("Steel Bolts");
  });

  it("warehouse updates correctly", () => {
    render(
      <FiltersProvider>
        <Filters warehouses={mockWarehouses} />
      </FiltersProvider>
    );

    const warehouseSelect = screen.getByDisplayValue(/All Warehouses/i);
    fireEvent.change(warehouseSelect, { target: { value: "MAR" } });
    expect((warehouseSelect as HTMLSelectElement).value).toBe("MAR");
  });

  it("status updates correctly", () => {
    render(
      <FiltersProvider>
        <Filters warehouses={mockWarehouses} />
      </FiltersProvider>
    );

    const statusSelect = screen.getByDisplayValue(/All Statuses/i);
    fireEvent.change(statusSelect, { target: { value: "healthy" } });
    expect((statusSelect as HTMLSelectElement).value).toBe("healthy");
  });
});
