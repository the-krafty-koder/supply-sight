import Filters from "./Filters";
import Products from "./Products";
import ProductDrawer from "./ProductDrawer";
import { memo, useCallback, useState } from "react";
import { useSuspenseQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "../graphql/queries";
import { useFilters } from "../context/FiltersContext";
import type { Product, Warehouse } from "../types";

const ProductsSegment = memo(({ warehouses }: { warehouses: Warehouse[] }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { debouncedSearch, status, warehouse, currentPage, rowsPerPage } =
    useFilters();

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseDrawer = () => {
    setSelectedProduct(null);
  };

  const { data: productData } = useSuspenseQuery<{
    products: Product[];
  }>(GET_PRODUCTS, {
    variables: {
      offset: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch || null,
      status: status || null,
      warehouse: warehouse || null,
    },
  });

  return (
    <>
      <Filters warehouses={warehouses || []} />
      <Products
        products={productData?.products || []}
        onProductClick={handleSelectProduct}
      />
      {selectedProduct && (
        <ProductDrawer product={selectedProduct} onClose={handleCloseDrawer} />
      )}
    </>
  );
});

export default ProductsSegment;
