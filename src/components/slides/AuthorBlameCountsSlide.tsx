import { useStats } from "@/src/hooks/endpoints/useStats";
import * as d3 from "d3";
import { AuthorBlameCount } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const BG_COLORS = [
  "rgba(255, 99, 132, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 206, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
  "rgba(255, 0, 0, 0.7)",
  "rgba(0, 255, 0, 0.7)",
  "rgba(0, 0, 255, 0.7)",
  "rgba(255, 255, 0, 0.7)",
  "rgba(255, 0, 255, 0.7)",
  "rgba(0, 255, 255, 0.7)",
  "rgba(128, 0, 0, 0.7)",
  "rgba(0, 128, 0, 0.7)",
  "rgba(0, 0, 128, 0.7)",
  "rgba(128, 128, 0, 0.7)",
  "rgba(128, 0, 128, 0.7)",
  "rgba(0, 128, 128, 0.7)",
  "rgba(255, 128, 0, 0.7)",
  "rgba(255, 0, 128, 0.7)",
  "rgba(128, 255, 0, 0.7)",
  "rgba(0, 255, 128, 0.7)",
  "rgba(128, 0, 255, 0.7)",
  "rgba(0, 128, 255, 0.7)",
  "rgba(255, 128, 128, 0.7)",
  "rgba(128, 255, 128, 0.7)",
  "rgba(128, 128, 255, 0.7)",
  "rgba(192, 192, 192, 0.7)",
  "rgba(128, 128, 128, 0.7)",
];

const BORDER_COLORS = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 0, 0, 1)",
  "rgba(0, 255, 0, 1)",
  "rgba(0, 0, 255, 1)",
  "rgba(255, 255, 0, 1)",
  "rgba(255, 0, 255, 1)",
  "rgba(0, 255, 255, 1)",
  "rgba(128, 0, 0, 1)",
  "rgba(0, 128, 0, 1)",
  "rgba(0, 0, 128, 1)",
  "rgba(128, 128, 0, 1)",
  "rgba(128, 0, 128, 1)",
  "rgba(0, 128, 128, 1)",
  "rgba(255, 128, 0, 1)",
  "rgba(255, 0, 128, 1)",
  "rgba(128, 255, 0, 1)",
  "rgba(0, 255, 128, 1)",
  "rgba(128, 0, 255, 1)",
  "rgba(0, 128, 255, 1)",
  "rgba(255, 128, 128, 1)",
  "rgba(128, 255, 128, 1)",
  "rgba(128, 128, 255, 1)",
  "rgba(192, 192, 192, 1)",
  "rgba(128, 128, 128, 1)",
];

type AuthorBlameCountsSlideProps = {
  part: string;
};

type PieChartData = {
  labels: string[];
  datasets: any[];
};

export default function AuthorBlameCountsSlide({
  part,
}: AuthorBlameCountsSlideProps) {
  const { data, error, isLoading } = useStats<AuthorBlameCount[]>({
    part: "authorBlames",
  });
  console.log("\n\n***** data *****\n", data, "\n\n");

  let CHART_DATA: PieChartData = {
    labels: [],
    datasets: [],
  };

  if (!isLoading) {
    CHART_DATA = {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: "Lines",
          data: data.map((d) => d.lineCount),
          backgroundColor: BG_COLORS.slice(0, data.length),
          borderColor: BORDER_COLORS.slice(0, data.length),
          borderWidth: 1,
        },
      ],
    };
  }

  return (
    <div className="AuthorBlameCountsSlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">
                Lines Owned by Engineer
              </h1>
            </div>
          )}
          {part === "main" && (
            <div className="h-[700px] w-[910px] flex justify-center">
              <Pie data={CHART_DATA} options={{ layout: { padding: 50 } }} />
            </div>
          )}
        </>
      )}
      {isLoading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div>
          <div>Error happened!</div>
        </div>
      )}
    </div>
  );
}
