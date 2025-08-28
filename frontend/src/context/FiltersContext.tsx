/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import type { ReactNode } from "react";

type FiltersContextType = {
  search: string;
  setSearch: (v: string) => void;
  debouncedSearch: string;
  status: string;
  setStatus: (v: string) => void;
  warehouse: string;
  setWarehouse: (v: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
  resetPagination: () => void;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, warehouse]);

  const resetPagination = () => setCurrentPage(1);

  return (
    <FiltersContext.Provider
      value={{
        search,
        setSearch,
        debouncedSearch,
        status,
        setStatus,
        warehouse,
        setWarehouse,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        resetPagination,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error("useFilters must be used within FiltersProvider");
  }
  return ctx;
};
