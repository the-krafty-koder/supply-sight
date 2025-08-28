import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, expect } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders the header", () => {
    const setDateRange = vi.fn();
    render(<Header dateRange="30d" setDateRange={setDateRange} />);

    expect(screen.getByText("SupplySight")).toBeInTheDocument();

    ["7d", "14d", "30d"].forEach((range) => {
      expect(screen.getByText(range)).toBeInTheDocument();
    });

    const active = screen.getByText("30d");
    expect(active).toHaveClass("bg-blue-600 text-white");
  });

  it("calls setDateRange when a range is clicked", async () => {
    const user = userEvent.setup();
    const setDateRange = vi.fn();
    render(<Header dateRange="7d" setDateRange={setDateRange} />);

    const button = screen.getByText("30d");
    await user.click(button);

    expect(setDateRange).toHaveBeenCalledWith("30d");
    expect(setDateRange).toHaveBeenCalledTimes(1);
  });
});
