import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KpiCards from "../components/KpiCards";
import type { KPI } from "../types";

describe("KpiCards", () => {
  const mockKpis: KPI[] = [
    {
      date: "2025-09-29",
      stock: 200,
      demand: 2150,
    },
    {
      date: "2025-09-30",
      stock: 150,
      demand: 2120,
    },
  ];

  it("renders all KPI cards", () => {
    render(<KpiCards kpis={mockKpis} />);

    expect(screen.getByText("Total Stock")).toBeInTheDocument();
    expect(screen.getByText("Total Demand")).toBeInTheDocument();
    expect(screen.getByText("Fill Rate")).toBeInTheDocument();
  });

  it("renders total stock correctly", () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByText("350")).toBeInTheDocument();
  });

  it("renders total demand correctly", () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByText("4270")).toBeInTheDocument();
  });

  it("renders fill rate correctly", () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByText("8.20%")).toBeInTheDocument();
  });
});
