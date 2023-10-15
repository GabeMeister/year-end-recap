import useEffectOnce from "@/src/hooks/useEffectOnce";
import { delay } from "@/src/utils/delay";
import * as d3 from "d3";
import Head from "next/head";

const HEIGHT = 400;
const WIDTH = 600;
const margin = {
  top: 50,
};

function randomLetters() {
  return d3
    .shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
    .slice(0, Math.floor(6 + Math.random() * 20))
    .sort();
}

function gabeLetters() {
  return d3.shuffle("GabeJensen".split(""));
}

export default function SelectJoinPage() {
  useEffectOnce(async () => {
    const svg = d3
      .select("#d3-chart")
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#fff");

    while (true) {
      const t = svg.transition().duration(750);

      svg
        .selectAll("text")
        .data(gabeLetters(), (d) => d as string)
        .join(
          (enter) => {
            return enter
              .append("text")
              .attr("fill", "green")
              .attr("font-weight", "bold")
              .attr("x", (d, i) => i * 16)
              .attr("y", -30)
              .text((d) => d)
              .call((enter) =>
                enter.transition(t as any).attr("y", margin.top + 0)
              );
          },
          (update) => {
            return update
              .attr("fill", "gray")
              .attr("y", margin.top + 0)
              .call((update) =>
                update.transition(t as any).attr("x", (d, i) => i * 16)
              );
          },
          (exit) => {
            return exit.attr("fill", "red").call((exit) =>
              exit
                .transition(t as any)
                .attr("y", margin.top + 30)
                .remove()
            );
          }
        );

      await delay(1000);
    }

    // svg
    //   .append("text")
    //   .attr("x", WIDTH / 2)
    //   .attr("y", HEIGHT / 2)
    //   .attr("text-anchor", "middle")
    //   .style("font-size", "24px")
    //   .style("fill", "black")
    //   .text(gabeLetters().join(" "));

    //   const svg = d3
    //     .select("#d3-chart")
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", 33)
    //     .attr("viewBox", `0 -20 ${width} 33`);

    //   while (true) {
    //     const t = svg.transition().duration(750);

    //     svg
    //       .selectAll("text")
    //       .data(randomLetters(), (d) => d as string)
    //       .join(
    //         (enter) =>
    //           enter
    //             .append("text")
    //             .attr("fill", "green")
    //             .attr("x", (d, i) => i * 16)
    //             .attr("y", -30)
    //             .text((d) => d)
    //             .call((enter) => enter.transition(t).attr("y", 0)),
    //         (update) =>
    //           update
    //             .attr("fill", "black")
    //             .attr("y", 0)
    //             .call((update) =>
    //               update.transition(t).attr("x", (d, i) => i * 16)
    //             ),
    //         (exit) =>
    //           exit
    //             .attr("fill", "brown")
    //             .call((exit) => exit.transition(t).attr("y", 30).remove())
    //       );

    //     await delay(1000);
    //   }
    // });
  });

  return (
    <>
      <Head>
        <title>D3 Select Join Example</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="p-6 flex justify-center">
        <div id="d3-chart" />
      </div>
    </>
  );
}
