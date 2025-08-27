import { Product } from "../types/index.ts";
import type { KPI, ProductStatus, Warehouse } from "../types/index.ts";

import data from "../db/data.json" assert { type: "json" };

type UpdateDemandArgs = { id: string; demand: number };
type TransferStockArgs = { id: string; from: string; to: string; qty: number };
type ProductArgs = {
  search?: string;
  status?: ProductStatus;
  warehouse?: string;
};
type KpiArgs = { range: string };

const products: Product[] = data.products;
const warehouses: Warehouse[] = data.warehouses;
const kpis: KPI[] = data.kpis;

const matchStatus = (p: Product, status?: ProductStatus): boolean => {
  switch (status) {
    case "healthy":
      return p.stock > p.demand;
    case "low":
      return p.stock === p.demand;
    case "critical":
      return p.stock < p.demand;
    default:
      return true;
  }
};

const resolvers = {
  Query: {
    products: (_: unknown, args: ProductArgs): Product[] => {
      const { search, status, warehouse } = args;
      return products.filter((p) => {
        const filteredSearch =
          !search ||
          [p.name, p.sku, p.id].some((v) =>
            v.toLowerCase().includes(search.toLowerCase())
          );
        const filteredWarehouse = !warehouse || p.warehouse === warehouse;
        const filteredStatus = matchStatus(p, status);
        return filteredSearch && filteredWarehouse && filteredStatus;
      });
    },

    warehouses: () => data.warehouses,

    kpis: (_: unknown, { range }: KpiArgs) => {
      let days: number;
      switch (range) {
        case "7d":
          days = 7;
          break;
        case "14d":
          days = 14;
          break;
        case "30d":
          days = 30;
          break;
        default:
          throw new Error(`Invalid range: ${range}. Use 7d, 14d, or 30d.`);
      }
      return data.kpis.slice(-days);
    },
  },

  Mutation: {
    updateDemand: (_: unknown, { id, demand }: UpdateDemandArgs): Product => {
      const product = products.find((p) => p.id === id);
      if (!product) throw new Error(`Product with id ${id} not found`);
      product.demand = demand;
      return product;
    },

    transferStock: (
      _: unknown,
      { id, from, to, qty }: TransferStockArgs
    ): Product => {
      const fromProduct = products.find(
        (p) => p.id === id && p.warehouse === from
      );
      if (!fromProduct)
        throw new Error(`Product ${id} not found in warehouse ${from}`);
      if (fromProduct.stock < qty)
        throw new Error(`Not enough stock in warehouse ${from}`);

      fromProduct.stock -= qty;

      let toProduct = products.find((p) => p.id === id && p.warehouse === to);
      if (toProduct) {
        toProduct.stock += qty;
      } else {
        toProduct = { ...fromProduct, warehouse: to, stock: qty };
        products.push(toProduct);
      }
      return toProduct;
    },
  },
};

export default resolvers;
