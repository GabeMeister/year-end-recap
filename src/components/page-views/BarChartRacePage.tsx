import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useEffectOnce from "@/src/hooks/useEffectOnce";
import Head from "next/head";
import { delay } from "@/src/utils/delay";
import { AuthorCommitsOverTime } from "@/src/types/git";

// Number of bars
const n = 12;

// The amount of "chunks" to break up the year values (we use linear interpolation)
const k = 5;

const LOOP_DELAY_IN_MS = 15;

// Duration of how long it takes to swap two rows (in ms)
const duration = 250;

// Height of the bar
const barSize = 30;
const margin = { top: 16, right: 6, bottom: 6, left: 100 };

const width = 600;
const height = margin.top + barSize * n + margin.bottom;

const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
const y = d3
  .scaleBand()
  .domain(d3.range(n + 1).map((d) => d.toString()))
  .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
  .padding(0.1);

const formatDate = d3.utcFormat("%B, %Y");
const formatNumber = d3.format(",d");

type BarChartRacePage = {
  commitsOverTime: AuthorCommitsOverTime;
};

export default function BarChartRacePage({
  commitsOverTime,
}: BarChartRacePage) {
  useEffectOnce(async () => {
    /*
     *   datevalues = [
     *     [Date(), Map(name, value)],
     *     [Date(), Map(name, value)],
     *   ]
     */
    const datevalues = Array.from(
      d3.rollup(
        commitsOverTime,
        ([d]) => d.value,
        (d) => +new Date(d.date),
        (d) => d.name
      )
    )
      .map(([date, data]) => [new Date(date), data])
      .sort(([a], [b]) => d3.ascending(a as Date, b as Date));

    const names = new Set(commitsOverTime.map((d) => d.name));

    // Rank all the companies for one particular day
    function rank(value: (name: string) => number) {
      const data = Array.from(names, (name) => ({
        name,
        value: value(name),
        rank: -1,
      }));
      data.sort((a, b) => d3.descending(a.value, b.value));

      for (let i = 0; i < data.length; ++i) {
        data[i].rank = Math.min(n, i);
      }

      return data;
    }

    // Break out every year into smaller "chunks" so that it's easier to follow
    // and animate. Otherwise several years will change at once and it's hard to
    // understand what's going on.
    function getKeyframes() {
      const keyframes: any[] = [];

      let ka, a, kb, b;

      /*
       * pairs = [
            [ [Date(), Map(name, value)], [Date(), Map(name, value)] ],
            [ [Date(), Map(name, value)], [Date(), Map(name, value)] ],
          ]
       */
      const pairs = d3.pairs(datevalues);

      for ([[ka, a], [kb, b]] of pairs) {
        for (let i = 0; i < k; ++i) {
          const t = i / k;
          keyframes.push([
            new Date(ka * (1 - t) + kb * t),
            rank(
              (name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t
            ),
          ]);
        }
      }
      keyframes.push([new Date(kb), rank((name) => b.get(name) || 0)]);

      return keyframes;
    }

    /*
      keyframes = [
        [ Date(), [{ name, value, rank}, { name, value, rank}, etc.] ],
        [ Date(), [{ name, value, rank}, { name, value, rank}, etc.] ],
      ]
    */
    const keyframes = getKeyframes();

    const nameframes = d3.groups(
      keyframes.flatMap(([, data]) => data),
      (d) => d.name
    );

    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));
    const prev = new Map(
      nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
    );

    // For transitioning text between updates
    function textTween(a, b) {
      const i = d3.interpolateNumber(a, b);
      return function (t) {
        // @ts-ignore
        this.textContent = formatNumber(i(t));
      };
    }

    const color = () => {
      const scale = d3.scaleOrdinal(d3.schemeTableau10);

      if (commitsOverTime.some((d) => d["category"] !== undefined)) {
        const categoryByName = new Map(
          commitsOverTime.map((d) => [d.name, d["category"]])
        );
        scale.domain(Array.from(categoryByName.values()));

        return (d) => {
          return scale(categoryByName.get(d.name) ?? d.name);
        };
      }

      return (d) => {
        return scale(d.name);
      };
    };

    function ticker(svg) {
      const now = svg
        .append("text")
        .style("font", `bold ${barSize}px var(--sans-serif)`)
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .attr("x", width - 6)
        .attr("y", margin.top + barSize * (n - 0.45))
        .attr("dy", "0.32em")
        .text(formatDate(keyframes[0][0]));

      return ([date], transition) => {
        const d = new Date(date);
        let ending = transition
          .end()
          .catch((e) => {
            // Absolutely no idea why, but the transition promise throws almost every time
            now.text(formatDate(d));
          })
          .then(() => {
            return now.text(formatDate(d));
          });
      };
    }

    function axis(svg) {
      const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);
      const axis = d3
        .axisTop(x)
        .ticks(width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()));

      return (_, transition) => {
        g.transition(transition).call(axis);
        g.select(".tick:first-of-type text").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
        g.select(".domain").remove();
      };
    }

    function labels(svg) {
      let label = svg
        .append("g")
        .style("font", "bold 12px var(--sans-serif)")
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .selectAll("text");

      return ([date, data], transition) =>
        (label = label
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append("text")
                .attr(
                  "transform",
                  (d) =>
                    `translate(${x((prev.get(d) || d).value)},${y(
                      (prev.get(d) || d).rank.toString()
                    )})`
                )
                .attr("y", y.bandwidth() / 2)
                .attr("x", -6)
                .attr("dy", "-.25em")
                .text((d) => d.name)
                .attr("font-size", "8px")
                .call((text) =>
                  text
                    .append("tspan")
                    .attr("fill-opacity", 0.6)
                    .attr("font-weight", "normal")
                    .attr("font-size", "8px")
                    .attr("x", -6)
                    .attr("dy", "1.15em")
                ),
            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .remove()
                .attr(
                  "transform",
                  (d) =>
                    `translate(${x((next.get(d) || d).value)},${y(
                      (next.get(d) || d).rank.toString()
                    )})`
                )
                .call((g) =>
                  g
                    .select("tspan")
                    .tween("text", (d) =>
                      textTween(d.value, (next.get(d) || d).value)
                    )
                )
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr(
                "transform",
                (d) => `translate(${x(d.value)},${y(d.rank.toString())})`
              )
              .call((g) =>
                g
                  .select("tspan")
                  .tween("text", (d) =>
                    textTween((prev.get(d) || d).value, d.value)
                  )
              )
          ));
    }

    function bars(svg) {
      let bar = svg.append("g").attr("fill-opacity", 0.8).selectAll("rect");

      return ([_, data], transition) => {
        return (bar = bar
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append("rect")
                .attr("fill", color())
                .attr("height", y.bandwidth())
                .attr("rx", "3px")
                .attr("ry", "3px")
                .attr("x", x(0))
                .attr("y", (d) => {
                  const final = (prev.get(d) || d).rank.toString();

                  return y(final);
                })
                .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),
            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .remove()
                .attr("y", (d) => {
                  const final = (next.get(d) || d).rank.toString();

                  return y(final);
                })
                .attr("width", (d) => x((next.get(d) || d).value) - x(0))
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr("y", (d) => {
                let final = y(d.rank.toString());

                return final;
              })
              .attr("width", (d) => x(d.value) - x(0))
          ));
      };
    }

    const svg = d3
      .select("#racing-bar-chart")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    for (const keyframe of keyframes) {
      const transition = svg
        .transition()
        .duration(duration)
        .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);
      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);

      await delay(LOOP_DELAY_IN_MS);
    }

    await delay(500);
    document.body.style.backgroundColor = "#ffebb3";
  });

  return (
    <>
      <Head>
        <title>Bar Chart Race</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex justify-center items-center text-xs">
        <div id="racing-bar-chart" className="w-1/2" />
      </div>
    </>
  );
}
