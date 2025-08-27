import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_KPIS } from "./graphql/queries";
import Header from "./components/Header";
import type { KPI } from "./types";
import KpiCards from "./components/KpiCards";

const App = () => {
  const [dateRange, setDateRange] = useState("30d");
  const { loading, error, data } = useQuery<{ kpis: KPI[] }>(GET_KPIS, {
    variables: { range: dateRange },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header dateRange={dateRange} setDateRange={setDateRange} />
      <div className="container mx-auto p-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && <KpiCards kpis={data.kpis} />}
      </div>
    </div>
  );
};

export default App;
