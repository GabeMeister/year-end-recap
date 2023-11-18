import * as d3 from "d3";
import { useStats } from "@/src/hooks/endpoints/useStats";
import { AuthorCommits } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect } from "react";
import Head from "next/head";

// Declare the chart dimensions and margins.
const width = 1200;
const height = 700;
const marginTop = 50;
const marginRight = 30;
const marginBottom = 100;
const marginLeft = 50;

type AllTimeAuthorCommitsSlide = {
  part: string;
};

export default function AllTimeAuthorCommitsSlide({
  part,
}: AllTimeAuthorCommitsSlide) {
  const {
    data: commits,
    error,
    isLoading,
  } = useStats<AuthorCommits[]>({
    part: "allTimeAuthorCommits",
  });

  useEffect(() => {
    if (!commits) {
      return;
    }

    if (!!document.querySelector("#racing-bar-chart svg")) {
      return;
    }

    // Sort from greatest to least
    commits.sort((a, b) => b.commits - a.commits);

    /*
     * X SCALE CALCULATION
     */
    const x = d3
      .scaleBand()
      .domain(
        d3.groupSort(
          commits,
          ([d]) => -d.commits,
          (d) => {
            return d.name;
          }
        )
      ) // descending frequency
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    /*
     * Y SCALE CALCULATION
     */
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(commits, (d) => d.commits) as number])
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
      // .attr("fill", "#f7f7f7")
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
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("font-size", "14px")
      .attr("dx", "2em")
      .attr("dy", "2rem")
      .attr("transform", "rotate(30)");

    /*
     * Y AXIS
     */
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat((y) => (y as number).toLocaleString()))
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
      .attr("x", (d) => x(d.name) as number)
      .attr("y", (d) => {
        return y(0);
      })
      .attr("height", (_d) => {
        return 0;
      })
      .attr("width", x.bandwidth() - 10);

    /*
     * BAR ANIMATION
     */
    svg
      .selectAll("#bars rect")
      .transition()
      .ease(d3.easeBackOut)
      .duration(800)
      .attr("y", function (d) {
        return y((d as any).commits);
      })
      .attr("height", function (d) {
        const zero = y(0);
        const yValue = y((d as any).commits);

        return zero - yValue;
      })
      .delay(function (_d, i) {
        return i * 100;
      });
  }, [commits, part]);

  return (
    <div className="AllTimeAuthorCommitsSlide">
      {commits && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">
                All Time Commits by Programmer
              </h1>
            </div>
          )}
          {part === "main" && (
            <div className="overflow-y-scroll h-[700px] w-[1210px]">
              <div id="bar-chart" className="shadow-2xl" />
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
