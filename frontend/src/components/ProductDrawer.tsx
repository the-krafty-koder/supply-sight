import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import type { Product, Warehouse } from "../types";
import {
  UPDATE_DEMAND,
  TRANSFER_STOCK,
  GET_WAREHOUSES,
} from "../graphql/queries";

interface ProductDrawerProps {
  product: Product;
  onClose: () => void;
}

const ProductDrawer = ({ product, onClose }: ProductDrawerProps) => {
  const [demand, setDemand] = useState(product.demand);
  const [transferQty, setTransferQty] = useState(0);
  const [targetWarehouse, setTargetWarehouse] = useState("");

  useEffect(() => {
    setDemand(product.demand);
  }, [product]);

  const { data: warehouseData } = useQuery<{ warehouses: Warehouse[] }>(
    GET_WAREHOUSES
  );

  const [updateDemand, { loading: demandLoading, error: demandError }] =
    useMutation(UPDATE_DEMAND, {
      refetchQueries: ["GetProducts"],
    });

  const [transferStock, { loading: transferLoading, error: transferError }] =
    useMutation(TRANSFER_STOCK, {
      refetchQueries: ["GetProducts"],
    });

  const handleUpdateDemand = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateDemand({
      variables: { id: product.id, demand: demand },
    });
    onClose();
  };

  const handleTransferStock = async (e: React.FormEvent) => {
    e.preventDefault();

    await transferStock({
      variables: {
        id: product.id,
        from: product.warehouse,
        to: targetWarehouse,
        qty: transferQty,
      },
    });
    setTransferQty(0);
    setTargetWarehouse("");
    onClose();
  };

  const otherWarehouses = warehouseData?.warehouses.filter(
    (w) => w.code !== product.warehouse
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-1/3 bg-white shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
        <button onClick={onClose} className=" bg-red-300 rounded-md p-2 ">
          <span>Close</span>
        </button>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Product:</span>
            <span>{product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">SKU:</span>
            <span>{product.sku}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Warehouse:</span>
            <span>{product.warehouse}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Stock:</span>
            <span>{product.stock}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Demand:</span>
            <span>{product.demand}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span>
              {product.stock > product.demand
                ? "Healthy"
                : product.stock === product.demand
                ? "Low"
                : "Critical"}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-lg font-medium text-gray-900">Update Demand</h4>
          <form onSubmit={handleUpdateDemand} className="mt-2 space-y-3">
            <div>
              <label
                htmlFor="demand"
                className="block text-sm font-medium text-gray-700"
              >
                New Demand
              </label>
              <input
                type="number"
                id="demand"
                name="demand"
                value={demand}
                onChange={(e) => setDemand(parseInt(e.target.value, 10))}
                className="mt-1 w-full rounded-md border-gray-300 "
              />
            </div>
            <button
              type="submit"
              disabled={demandLoading}
              className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-indigo-600  disabled:opacity-50"
            >
              {demandLoading ? "Updating..." : "Update Demand"}
            </button>

            {demandError && (
              <p className="mt-2 text-sm text-red-600">
                Error: {demandError.message}
              </p>
            )}
          </form>
        </div>

        {otherWarehouses && otherWarehouses.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-lg font-medium text-gray-900">
              Transfer Stock
            </h4>
            <form onSubmit={handleTransferStock} className="mt-2 space-y-3">
              <div>
                <label
                  htmlFor="transfer-qty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="transfer-qty"
                  name="transfer-qty"
                  value={transferQty}
                  onChange={(e) => setTransferQty(parseInt(e.target.value, 10))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  min="1"
                  max={product.stock}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="target-warehouse"
                  className="block text-sm font-medium text-gray-700"
                >
                  To Warehouse
                </label>
                <select
                  id="target-warehouse"
                  name="target-warehouse"
                  value={targetWarehouse}
                  onChange={(e) => setTargetWarehouse(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 "
                  required
                >
                  <option value="">Select a warehouse</option>
                  {otherWarehouses.map((warehouse) => (
                    <option key={warehouse.code} value={warehouse.code}>
                      {warehouse.name} - {warehouse.code}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={
                  transferLoading || transferQty <= 0 || !targetWarehouse
                }
                className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600  disabled:opacity-50"
              >
                {transferLoading ? "Transferring..." : "Transfer Stock"}
              </button>
              {transferError && (
                <p className="mt-2 text-sm text-red-600">
                  Error: {transferError.message}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDrawer;
