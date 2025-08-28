import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_WAREHOUSES } from "./graphql/queries";
import Header from "./components/Header";
import { FiltersProvider } from "./context/FiltersContext";
import ProductsSegment from "./components/ProductsSegment";
import ErrorBoundary from "./components/ErrorBoundary";
import type { Warehouse } from "./types";
import KPISegment from "./components/KPISegment";

const App = () => {
  const [dateRange, setDateRange] = useState("30d");

  const { data: warehouseData } = useQuery<{
    warehouses: Warehouse[];
  }>(GET_WAREHOUSES);

  return (
    <FiltersProvider>
      <div className="min-h-screen bg-slate-50">
        <Header dateRange={dateRange} setDateRange={setDateRange} />
        <div className="container mx-auto p-4 space-y-6">
          <ErrorBoundary
            fallback={
              <div className="bg-white p-4 shadow-sm border border-gray-200">
                Unable to fetch KPI Data
              </div>
            }
          >
            <KPISegment dateRange={dateRange} />
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="bg-white p-4 shadow-sm border border-gray-200">
                Unable to fetch products{" "}
              </div>
            }
          >
            <ProductsSegment warehouses={warehouseData?.warehouses || []} />
          </ErrorBoundary>
        </div>
      </div>
    </FiltersProvider>
  );
};

export default App;
