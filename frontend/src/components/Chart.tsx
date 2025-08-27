import {
  CartesianGrid,
  Tooltip,
  Line,
  XAxis,
  LineChart,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { KPI } from "../types";

interface ChartProps {
  kpis: KPI[];
}

const Chart = ({ kpis }: ChartProps) => {
  if (!kpis?.length) return null;

  const data = kpis.map((kpi) => ({
    ...kpi,
    date: new Date(kpi.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Trend of Stock vs Demand
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#4b5563" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#2563eb"
            strokeWidth={2}
            name="Stock"
          />
          <Line
            type="monotone"
            dataKey="demand"
            stroke="#d97706"
            strokeWidth={2}
            name="Demand"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
