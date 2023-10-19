import SquarePage from "@/src/components/page-views/SquarePage";
import * as d3 from "d3";
import useEffectOnce from "@/src/hooks/useEffectOnce";
import Head from "next/head";

// Declare the chart dimensions and margins.
const width = 600;
const height = 400;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 40;

const animalData = [
  { animal: "Dog", count: 4, order: 1 },
  { animal: "Cat", count: 7, order: 2 },
];

export default function Square() {
  useEffectOnce(async () => {
    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("rect")
      .attr("fill", "#ededed")
      .attr("rx", "5px")
      .attr("ry", "5px")
      .attr("stroke", "black")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", "100%")
      .attr("width", "100%");

    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(animalData)
      .join("rect")
      .attr("x", (d) => {
        return marginLeft + d.count * 10;
      })
      .attr("y", (d) => {
        return height - marginBottom - 50;
      })
      .attr("height", 1)
      .attr("width", 25)
      .call((bar) => {
        const transition = svg
          .transition()
          .delay(750)
          .duration(1000)
          .ease(d3.easeCubicOut);

        return bar
          .transition(transition as any)
          .attr("height", 250)
          .attr("y", 20);
      });
  });

  return (
    <>
      <Head>
        <title>Square</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-center items-center text-xs p-6 gap-4">
        <h1 className="text-2xl">Square Page</h1>
        <div id="bar-chart" />
      </div>
    </>
  );
}
