import { useSuspenseQuery } from "@apollo/client/react";
import { GET_KPIS } from "../graphql/queries";
import type { KPI } from "../types";
import KpiCards from "./KpiCards";
import Chart from "./Chart";

interface KPISegmentProps {
  dateRange: string;
}

const KPISegment = ({ dateRange }: KPISegmentProps) => {
  const { data } = useSuspenseQuery<{ kpis: KPI[] }>(GET_KPIS, {
    variables: { range: dateRange },
  });

  return (
    <>
      <KpiCards kpis={data.kpis} />
      <Chart kpis={data.kpis} />
    </>
  );
};

export default KPISegment;
