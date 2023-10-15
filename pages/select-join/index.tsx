import dynamic from "next/dynamic";
const SelectJoinPage = dynamic(
  () => import("../../src/components/page-views/SelectJoinPage"),
  { ssr: false }
);

const BarChartRace = () => <SelectJoinPage />;

export default BarChartRace;
