import type { KPI } from "../types";

type KpiCardsProps = {
  kpis: KPI[];
};

const KpiCards = ({ kpis }: KpiCardsProps) => {
  const totalStock = kpis.reduce((sum, kpi) => sum + kpi.stock, 0);
  const totalDemand = kpis.reduce((sum, kpi) => sum + kpi.demand, 0);
  const filledDemand = kpis.reduce(
    (sum, kpi) => sum + Math.min(kpi.stock, kpi.demand),
    0
  );
  const fillRate = totalDemand > 0 ? (filledDemand / totalDemand) * 100 : 0;

  const cardData = [
    {
      label: "Total Stock",
      value: totalStock.toString(),
      color: "text-blue-600",
    },
    {
      label: "Total Demand",
      value: totalDemand.toString(),
      color: "text-yellow-600",
    },
    {
      label: "Fill Rate",
      value: `${fillRate.toFixed(2)}%`,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cardData.map((card) => (
        <div
          key={card.label}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <p className="text-gray-500 text-sm font-medium">{card.label}</p>
          <h2 className={`text-4xl font-bold mt-2 ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
