import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import ProductDrawer from "../components/ProductDrawer";
import {
  GET_WAREHOUSES,
  UPDATE_DEMAND,
  TRANSFER_STOCK,
} from "../graphql/queries";
import type { Product, Warehouse } from "../types";

const mockProduct: Product = {
  id: "P1",
  name: "Steel Bolts",
  sku: "SKU-001",
  warehouse: "W1",
  stock: 100,
  demand: 50,
};

const mockWarehouses: Warehouse[] = [
  { code: "W1", name: "Warehouse 1", city: "Paris", country: "France" },
  { code: "W2", name: "Warehouse 2", city: "Marseille", country: "France" },
];

const mocks = [
  {
    request: { query: GET_WAREHOUSES },
    result: { data: { warehouses: mockWarehouses } },
  },
  {
    request: { query: UPDATE_DEMAND, variables: { id: "P1", demand: 60 } },
    result: { data: { updateDemand: { id: "P1", demand: 60 } } },
  },
  {
    request: {
      query: TRANSFER_STOCK,
      variables: { id: "P1", from: "W1", to: "W2", qty: 20 },
    },
    result: { data: { transferStock: { success: true } } },
  },
];

describe("ProductDrawer", () => {
  it("renders product details and forms", async () => {
    const onClose = vi.fn();

    render(
      <MockedProvider mocks={mocks}>
        <ProductDrawer product={mockProduct} onClose={onClose} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    });

    expect(await screen.findByText("Steel Bolts")).toBeInTheDocument();
    expect(screen.getByText("SKU-001")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();

    const demandInput = screen.getByLabelText(/New Demand/i);
    fireEvent.change(demandInput, { target: { value: "60" } });
    expect((demandInput as HTMLInputElement).value).toBe("60");

    const updateButton = screen.getByRole("button", { name: /Update Demand/i });
    fireEvent.click(updateButton);

    const qtyInput = screen.getByLabelText(/Quantity/i);
    const selectInput = screen.getByLabelText(/To Warehouse/i);

    fireEvent.change(qtyInput, { target: { value: "20" } });
    fireEvent.change(selectInput, { target: { value: "W2" } });

    const transferButton = screen.getByRole("button", {
      name: /Transfer Stock/i,
    });
    fireEvent.click(transferButton);

    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
