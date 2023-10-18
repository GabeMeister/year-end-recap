import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import rawData from "../../data/bar_chart_data.json";
import useEffectOnce from "@/src/hooks/useEffectOnce";
import Head from "next/head";

// Declare the chart dimensions and margins.
const width = 928;
const height = 500;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 40;

// type BarChartData = { letter: string; frequency: number };
// const data = rawData as BarChartData[];

export default function BarChartPage() {
  useEffectOnce(async () => {
    const gabe = d3.groupSort(
      rawData,
      ([d]) => -d.frequency,
      (d) => d.letter
    );

    // Declare the x (horizontal position) scale.
    const x = d3
      .scaleBand()
      .domain(
        d3.groupSort(
          rawData,
          ([d]) => -d.frequency,
          (d) => d.letter
        )
      ) // descending frequency
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    // Declare the y (vertical position) scale.
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(rawData, (d) => d.frequency) as number])
      .range([height - marginBottom, marginTop]);

    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    // Add a rect for each bar.
    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(rawData)
      .join("rect")
      .attr("x", (d) => x(d.letter) as number)
      .attr("y", (d) => y(d.frequency))
      .attr("height", (d) => {
        return 0;
        console.log("\n\n***** d *****\n", d, "\n\n");

        const zero = y(0);
        console.log("\n\n***** zero *****\n", zero, "\n\n");
        const freq = y(d.frequency);
        console.log("\n\n***** freq *****\n", freq, "\n\n");

        return zero - freq;
      })
      .attr("width", x.bandwidth());

    // Animation
    svg
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", function (d) {
        return y((d as any).frequency);
      })
      .attr("height", function (d) {
        return height - y((d as any).frequency);
      })
      .delay(function (d, i) {
        console.log(i);
        return i * 100;
      });

    // Add the x-axis and label.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add the y-axis and label, and remove the domain line.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Frequency (%)")
      );
  });

  return (
    <>
      <Head>
        <title>Bar Chart</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex justify-center items-center text-xs">
        <div id="bar-chart" className="w-1/2" />
      </div>
    </>
  );
}
