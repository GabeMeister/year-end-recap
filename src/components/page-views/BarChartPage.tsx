import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useEffectOnce from "@/src/hooks/useEffectOnce";
import Head from "next/head";
import { AuthorCommits, RepoRecap } from "@/src/types/git";

// Declare the chart dimensions and margins.
const width = 1000;
const height = 500;
const marginTop = 50;
const marginRight = 30;
const marginBottom = 80;
const marginLeft = 50;

type BarChartPageProps = {
  commits: AuthorCommits[];
};

export default function BarChartPage({ commits }: BarChartPageProps) {
  useEffectOnce(async () => {
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
          (d) => d.name
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
      .attr("fill", "#f7f7f7")
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
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft + 20)
          .attr("y", 30)
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
  });

  return (
    <>
      <Head>
        <title>Bar Chart</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex justify-center items-center text-xs p-6 bg-yer-blue-200 min-h-screen">
        <div id="bar-chart" className="shadow-2xl" />
      </div>
    </>
  );
}
