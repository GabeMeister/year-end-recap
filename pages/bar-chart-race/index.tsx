import dynamic from "next/dynamic";
const BarChartRacePage = dynamic(
  () => import("../../src/components/page-views/BarChartRacePage"),
  { ssr: false }
);

const BarChartRace = () => <BarChartRacePage />;

export default BarChartRace;
