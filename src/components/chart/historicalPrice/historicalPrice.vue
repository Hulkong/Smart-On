
<template>
  <div class="chart historical-pirce-component"></div>
</template>

<script>
export default {
  name: "historicalPirce",

  props: { options: Object },

  data() {
    return {
      chartData: [] // 데이터
    };
  },

  created() {},

  mounted() {},

  // 뷰
  template: "",

  methods: {
    /**
     * @description 차트 그리는 함수
     * @param {Array data}: 데이터
     * @param {Object options}: 옵션
     */
    draw(data, options) {
      if (!data || data.length === 0) return; // 데이터가 없을 경우 리턴

      const element = this.$el;
      const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis
      const isxAxis = chartOption["xAxis"];
      const isyAxis = chartOption["yAxis"];
      const ticks = chartOption["tick"];

      const width =
        Number(
          d3
            .select(element)
            .style("width")
            .replace("px", "")
        ) -
        margin.left -
        margin.right; // Use the window's width
      const height =
        Number(
          d3
            .select(element)
            .style("height")
            .replace("px", "")
        ) -
        margin.top -
        margin.bottom; // Use the window's height

      // find data range
      const xMin = d3.min(data, d => {
        return d["date"];
      });

      const xMax = d3.max(data, d => {
        return d["date"];
      });

      const yMin = d3.min(data, d => {
        return d["totExp"];
      });

      const yMax = d3.max(data, d => {
        return d["totExp"];
      });

      // scale using range
      const xScale = d3.time
        .scale()
        .domain([xMin, xMax])
        .range([0, width]);

      const yScale = d3.scale
        .linear()
        .domain([yMin - 5, yMax])
        .range([height, 0]);

      // add chart SVG to the page
      const svg = d3
        .select(element)
        .append("svg")
        .attr("id", id)
        .attr("width", width + margin["left"] + margin["right"])
        .attr("height", height + margin["top"] + margin["bottom"])
        // .call(this.responsivefy)
        .append("g")
        .attr("transform", `translate(${margin["left"]}, ${margin["top"]})`);

      // create the axes component
      let xAxis = d3.svg
        .axis()
        .scale(xScale)
        .orient("bottom")
        .outerTickSize(1);

      let yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient("left")
        .ticks(5)
        .outerTickSize(1);

      // x Axis
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("dx", "-.8em")
        .attr("dy", "1em");

      svg
        .append("g")
        .attr("class", "y axis")
        .attr("font-size", "12px")
        .call(yAxis);

      // renders totExp price line chart and moving average line chart

      // generates lines when called
      const line1 = d3.svg
        .line()
        .x(d => {
          return xScale(d["date"]);
        })
        .y(d => {
          return yScale(d["totExp"]);
        });

      const line2 = d3.svg
        .line()
        .x(d => {
          return xScale(d["date"]);
        })
        .y(d => {
          return yScale(d["expAmt"]);
        });

      const movingAverageLine = d3.svg
        .line()
        .x(d => {
          return xScale(d["date"]);
        })
        .y(d => {
          return yScale(d["average"]);
        })
        .interpolate(d3.curveBasis);

      svg
        .append("path")
        .data([data]) // binds data to the line
        .style("fill", "none")
        .attr("id", "priceChart")
        .attr("stroke", "steelblue")
        .attr("stroke-width", "1.5")
        .attr("d", line1);

      // calculates simple moving average over 50 days
      const movingAverageData = this.movingAverage(data, 49);
      svg
        .append("path")
        // .data([movingAverageData])
        .data([data])
        .style("fill", "none")
        .attr("id", "movingAverageLine")
        .attr("stroke", "#FF8900")
        // .attr("d", movingAverageLine);
        .attr("d", line2);

      // renders x and y crosshair
      const focus = svg
        .append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("circle").attr("r", 4.5);
      focus.append("line").classed("x", true);
      focus.append("line").classed("y", true);

      svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", () => focus.style("display", null))
        .on("mouseout", () => focus.style("display", "none"))
        .on("mousemove", generateCrosshair);

      d3.select(".overlay").style("fill", "none");
      d3.select(".overlay").style("pointer-events", "all");

      d3.selectAll(".focus line").style("fill", "none");
      d3.selectAll(".focus line").style("stroke", "#67809f");
      d3.selectAll(".focus line").style("stroke-width", "1.5px");
      d3.selectAll(".focus line").style("stroke-dasharray", "3 3");

      //returs insertion point
      const bisectDate = d3.bisector(d => d.date).left;

      /* mouseover function to generate crosshair */
      function generateCrosshair() {
        //returns corresponding value from the domain
        const correspondingDate = xScale.invert(d3.mouse(this)[0]);
        //gets insertion point
        const i = bisectDate(data, correspondingDate, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const currentPoint =
          correspondingDate - d0["date"] > d1["date"] - correspondingDate
            ? d1
            : d0;
        focus.attr(
          "transform",
          `translate(${xScale(currentPoint["date"])}, ${yScale(
            currentPoint["totExp"]
          )})`
        );

        focus
          .select("line.x")
          .attr("x1", 0)
          .attr("x2", width - xScale(currentPoint["date"]))
          .attr("y1", 0)
          .attr("y2", 0);

        focus
          .select("line.y")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", 0)
          .attr("y2", height - yScale(currentPoint["totExp"]));

        // updates the legend to display the date, open, totExp, high, low, and volume of the selected mouseover area
        updateLegends(currentPoint);
      }

      /* Legends */
      const updateLegends = currentData => {
        d3.selectAll(".lineLegend").remove();

        const legendKeys = Object.keys(data[0]);
        const lineLegend = svg
          .selectAll(".lineLegend")
          .data(legendKeys)
          .enter()
          .append("g")
          .attr("class", "lineLegend")
          .attr("transform", (d, i) => {
            return `translate(0, ${i * 20})`;
          });
        lineLegend
          .append("text")
          .text(d => {
            return `${d}: ${currentData[d]}`;
            // if (d === "date") {
            //   return `${d}: ${currentData[d].toLocaleDateString()}`;
            // } else if (
            //   d === "high" ||
            //   d === "low" ||
            //   d === "open" ||
            //   d === "totExp"
            // ) {
            //   return `${d}: ${currentData[d].toFixed(2)}`;
            // } else {
            //   return `${d}: ${currentData[d]}`;
            // }
          })
          .style("fill", "black")
          .attr("transform", "translate(15,9)"); //align texts with boxes
      };

      /* Volume series bars */
      // const volData = data.filter(
      //   d => d["volume"] !== null && d["volume"] !== 0
      // );

      // const yMinVolume = d3.min(volData, d => {
      //   return Math.min(d["volume"]);
      // });

      // const yMaxVolume = d3.max(volData, d => {
      //   return Math.max(d["volume"]);
      // });

      // const yVolumeScale = d3.scale
      //   .linear()
      //   .domain([yMinVolume, yMaxVolume])
      //   .range([height, height * (3 / 4)]);

      // svg
      //   .selectAll()
      //   .data(volData)
      //   .enter()
      //   .append('rect')
      //   .attr('x', d => {
      //     return xScale(d['date']);
      //   })
      //   .attr('y', d => {
      //     return yVolumeScale(d['volume']);
      //   })
      //   .attr('class', 'vol')
      //   .attr('fill', (d, i) => {
      //     if (i === 0) {
      //       return '#03a678';
      //     } else {
      //       return volData[i - 1].totExp > d.totExp ? '#c0392b' : '#03a678'; // green bar if price is rising during that period, and red when price  is falling
      //     }
      //   })
      //   .attr('width', 1)
      //   .attr('height', d => {
      //     return height - yVolumeScale(d['volume']);
      //   });
      // testing axis for volume
      /*
  svg.append('g').call(d3.axisLeft(yVolumeScale));
  */
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      d3.select(this.$el)
        .select("svg")
        .remove();
    },

    movingAverage: (data, numberOfPricePoints) => {
      return data.map((row, index, total) => {
        const start = Math.max(0, index - numberOfPricePoints);
        const end = index;
        const subset = total.slice(start, end + 1);
        const sum = subset.reduce((a, b) => {
          return a + b["totExp"];
        }, 0);

        return {
          date: row["date"],
          average: sum / subset.length
        };
      });
    }
    // credits: https://brendansudol.com/writing/responsive-d3
    /*
    responsivefy: svg => {
      // get element + svg aspect ratio
      const element = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

      // get width of element and resize svg to fit it
      const resize = () => {
        var targetWidth = parseInt(element.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
      };

      // add viewBox and preserveAspectRatio properties,
      // and call resize so that svg resizes on inital page load
      svg
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

      // to register multiple listeners for same event type,
      // you need to add namespace, i.e., 'click.foo'
      // necessary if you call invoke this function for multiple svgs
      // api docs: https://github.com/mbostock/d3/wiki/Selections#on
      d3.select(window).on("resize." + element.attr("id"), resize);
    }
    */
  }
};
</script>

<style scoped>
.historical-pirce-component {
  color: #67809f;
  width: 100%;
  height: 100%;
  position: absolute;
}

.historical-pirce-component >>> a {
  color: #67809f;
}
</style>
