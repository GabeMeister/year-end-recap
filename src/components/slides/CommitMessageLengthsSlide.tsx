import { useStats } from "@/src/hooks/endpoints/useStats";
import * as d3 from "d3";
import { CommitMessageLength } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect } from "react";

const width = 900;
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
  const { data, error, isLoading } = useStats<CommitMessageLength[]>({
    part: "commitMessageLengths",
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!!document.querySelector("#bar-chart svg")) {
      return;
    }

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip px-3 py-1 rounded-sm")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white");

    // We want the shortest commits first
    const commits = data?.toReversed();

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

    const lengths = commits.map((c) => c.length).sort((a, b) => a - b);

    // Round to the nearest interval of "50" for the x axis
    const percentiles = [
      (Math.round((d3.quantile(lengths, 0.25) ?? 0) / 50) * 50).toString(),
      (Math.round((d3.quantile(lengths, 0.5) ?? 0) / 50) * 50).toString(),
      (Math.round((d3.quantile(lengths, 0.75) ?? 0) / 50) * 50).toString(),
    ];

    /*
     * X AXIS
     */
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickValues(percentiles).tickSizeOuter(0))
      .call((g) =>
        g
          .append("text")
          .attr("x", width / 2 - 120)
          .attr("y", 50)
          .attr("font-size", "18px")
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("→ Commit Length")
      )
      .selectAll("text")
      .attr("font-size", "16px");

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
          .text("↑ # of Commits")
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
      .attr("width", x.bandwidth())
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(
            `# of Commits: ${
              d.frequency
            } <br /> Commit Length: ${d.length.toLocaleString()}`
          )
          .style("left", event.pageX - 50 + "px")
          .style("top", event.pageY - 100 + "px");
      })
      .on("mousemove", (event, _d) => {
        tooltip
          .style("left", event.pageX - 50 + "px")
          .style("top", event.pageY - 100 + "px");
      })
      .on("mouseout", (_d) => {
        tooltip.style("opacity", 0);
      });

    /*
     * BAR ANIMATION
     */
    svg
      .selectAll("#bars rect")
      .transition()
      .ease(d3.easeBackOut)
      .duration(600)
      .attr("y", function (d) {
        return y((d as any).frequency);
      })
      .attr("height", function (d) {
        const zero = y(0);
        const yValue = y((d as any).frequency);

        return zero - yValue;
      })
      .delay(function (_d, i) {
        return i * 5;
      });
  }, [data, part]);

  return (
    <div className="CommitMessageLengthsSlide">
      {data && (
        <>
          {part === "main" && (
            <div className="h-[700px] w-[910px]">
              <div id="bar-chart" />
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
