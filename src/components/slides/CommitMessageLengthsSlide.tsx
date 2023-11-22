import { useStats } from "@/src/hooks/endpoints/useStats";
import * as d3 from "d3";
import { CommitMessageLength } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect } from "react";

const width = 1200;
const height = 700;
const marginTop = 50;
const marginRight = 30;
const marginBottom = 100;
const marginLeft = 50;

type CommitMessageLengthsSlideProps = {
  part: string;
};

export default function CommitMessageLengthsSlide({
  part,
}: CommitMessageLengthsSlideProps) {
  const {
    data: commits,
    error,
    isLoading,
  } = useStats<CommitMessageLength[]>({
    part: "commitMessageLengths",
  });

  useEffect(() => {
    if (!commits) {
      return;
    }

    if (!!document.querySelector("#bar-chart svg")) {
      return;
    }

    // We want the shortest commits first
    commits?.reverse();

    /*
     * X SCALE CALCULATION
     */
    const x = d3
      .scaleBand()
      .domain(commits.map((c) => c.length.toString()))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    /*
     * Y SCALE CALCULATION
     */
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(commits, (d) => d.frequency) as number])
      .range([height - marginBottom, marginTop]);

    /*
     * INITIALIZE
     */
    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    /*
     * BACKGROUND
     */
    svg
      .append("g")
      .attr("id", "background")
      .append("rect")
      .attr("fill", "transparent")
      .attr("rx", "5px")
      .attr("ry", "5px")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", "100%")
      .attr("width", "100%");

    /*
     * X AXIS
     */
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickValues(["50", "100", "150"]).tickSizeOuter(0))
      .selectAll("text")
      .attr("font-size", "14px");

    /*
     * Y AXIS
     */
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickFormat((y) => (y as number).toLocaleString())
          .ticks(5)
      )
      .call((g) => g.selectAll("text").attr("font-size", "14px"))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft + 20)
          .attr("y", 30)
          .attr("font-size", "18px")
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Number of Commits")
      );

    /*
     * BARS
     */
    svg
      .append("g")
      .attr("id", "bars")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(commits)
      .join("rect")
      .attr("x", (d) => x(d.length.toString()) as number)
      .attr("y", (d) => {
        return y(0);
      })
      .attr("height", (_d) => {
        return 0;
      })
      .attr("width", x.bandwidth() - 2);

    /*
     * BAR ANIMATION
     */
    svg
      .selectAll("#bars rect")
      .transition()
      .ease(d3.easeBackOut)
      .duration(800)
      .attr("y", function (d) {
        return y((d as any).frequency);
      })
      .attr("height", function (d) {
        const zero = y(0);
        const yValue = y((d as any).frequency);

        return zero - yValue;
      })
      .delay(function (_d, i) {
        return i * 20;
      });
  }, [commits, part]);

  return (
    <div className="CommitMessageLengthsSlide">
      {commits && (
        <>
          {part === "main" && (
            <div className="h-[700px] w-[1210px]">
              <div id="bar-chart" className="" />
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
