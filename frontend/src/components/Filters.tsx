import { useFilters } from "../context/FiltersContext";
import type { Warehouse } from "../types";

interface FiltersProps {
  warehouses: Warehouse[];
}

const Filters = ({ warehouses }: FiltersProps) => {
  const { search, setSearch, status, setStatus, warehouse, setWarehouse } =
    useFilters();

  return (
    <div className="flex flex-row gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200 ">
      <input
        type="text"
        placeholder="Search by name, SKU, or ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-2 px-4 py-2 border rounded-md"
      />

      <select
        value={warehouse}
        onChange={(e) => setWarehouse(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-md "
      >
        <option value="">All Warehouses</option>
        {warehouses.map((w) => (
          <option key={w.code} value={w.code}>
            {w.name} - {w.code}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-md"
      >
        <option value="">All Statuses</option>
        <option value="healthy">Healthy</option>
        <option value="low">Low</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  );
};

export default Filters;
