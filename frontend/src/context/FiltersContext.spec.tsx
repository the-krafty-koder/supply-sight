import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { FiltersProvider, useFilters } from "../context/FiltersContext";

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

describe("FiltersContext", () => {
  it("provides default values", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(result.current.search).toBe("");
    expect(result.current.status).toBe("");
    expect(result.current.warehouse).toBe("");
    expect(result.current.currentPage).toBe(1);
    expect(result.current.rowsPerPage).toBe(10);
  });

  it("updates search, status, warehouse, and currentPage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.setSearch("test");
      result.current.setStatus("healthy");
      result.current.setWarehouse("W1");
    });

    expect(result.current.search).toBe("test");
    expect(result.current.status).toBe("healthy");
    expect(result.current.warehouse).toBe("W1");

    act(() => {
      result.current.setCurrentPage(5);
      result.current.setSearch("new");
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("can reset pagination", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.setCurrentPage(5);
      result.current.resetPagination();
    });

    expect(result.current.currentPage).toBe(1);
  });
});
