import type { Product } from "../types";

interface ProductsProps {
  products: Product[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  onProductClick: (product: Product) => void;
}

const Products = ({
  products,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  onProductClick,
}: ProductsProps) => {
  const renderStatusPill = (stock: number, demand: number) => {
    if (stock > demand) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
          Healthy
        </span>
      );
    } else if (stock === demand) {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
          Low
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
          Critical
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Product", "SKU", "Warehouse", "Stock", "Demand", "Status"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-100 transition-colors cursor-pointer ${
                  product.stock < product.demand ? "bg-red-50" : ""
                }`}
                onClick={() => onProductClick(product)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.warehouse}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.demand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderStatusPill(product.stock, product.demand)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">Page {currentPage}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() =>
              products.length === rowsPerPage && setCurrentPage(currentPage + 1)
            }
            disabled={products.length < rowsPerPage}
            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
