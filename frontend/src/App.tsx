import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_KPIS, GET_PRODUCTS, GET_WAREHOUSES } from "./graphql/queries";
import Header from "./components/Header";
import KpiCards from "./components/KpiCards";
import Chart from "./components/Chart";
import Filters from "./components/Filters";
import { useDebounce } from "./hooks/useDebounce";
import Products from "./components/Products";
import ProductDrawer from "./components/ProductDrawer";
import type { KPI, Product, Warehouse } from "./types";

const App = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const rowsPerPage = 10;

  const debouncedSearch = useDebounce(search, 300);

  // Fetch KPIs
  const {
    loading: kpiLoading,
    error: kpiError,
    data: kpiData,
  } = useQuery<{ kpis: KPI[] }>(GET_KPIS, { variables: { range: dateRange } });

  // Fetch products with pagination and filters
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery<{
    products: Product[];
  }>(GET_PRODUCTS, {
    variables: {
      offset: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch || null,
      status: selectedStatus || null,
      warehouse: selectedWarehouse || null,
    },
  });

  const { data: warehouseData } = useQuery<{ warehouses: Warehouse[] }>(
    GET_WAREHOUSES
  );

  const handleFilterChange = () => setCurrentPage(1);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDrawer = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header dateRange={dateRange} setDateRange={setDateRange} />
      <div className="container mx-auto p-4 space-y-6">
        {/* KPIs */}
        {kpiLoading && <p>Loading KPIs...</p>}
        {kpiError && <p>Error: {kpiError.message}</p>}
        {kpiData && kpiData.kpis.length > 0 && (
          <>
            <KpiCards kpis={kpiData.kpis} />
            <Chart kpis={kpiData.kpis} />
          </>
        )}

        {/* Products */}
        {productLoading || productError ? (
          <p>
            {productError
              ? `Error: ${productError.message}`
              : "Loading Products..."}
          </p>
        ) : (
          <>
            <Filters
              search={search}
              setSearch={(val) => {
                setSearch(val);
                handleFilterChange();
              }}
              status={selectedStatus}
              setStatus={(val) => {
                setSelectedStatus(val);
                handleFilterChange();
              }}
              selectedWarehouse={selectedWarehouse}
              setSelectedWarehouse={(val) => {
                setSelectedWarehouse(val);
                handleFilterChange();
              }}
              warehouses={warehouseData?.warehouses || []}
            />
            <Products
              products={productData?.products || []}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onProductClick={handleSelectProduct}
            />
          </>
        )}

        {selectedProduct && (
          <ProductDrawer
            product={selectedProduct}
            onClose={handleCloseDrawer}
          />
        )}
      </div>
    </div>
  );
};

export default App;
