
<template>
  <div class="chart historical-pirce-component">
    <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>
    <div class="_default_image">
      <img class="_image" :src="getImageUrl('common/img_ready.png')" alt />
      <p class="_text">준비중입니다.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "historicalPirce",

  props: { options: Object },

  data() {
    return {
      copyData: [],
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

      const that = this;
      const element = this.$el;
      const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis
      const isxAxis = chartOption["xAxis"];
      const isyAxis = chartOption["yAxis"];
      const ticks = chartOption["tick"];
      const category = chartOption["category"];
      const filterData = [];

      data.reduce((acc, v, i) => {
        let time = v["date"];
        let year = time.substr(0, 4);
        let month = time.substr(4, 2);
        let day = time.substr(6, 2);

        filterData[i] = {
          date: new Date(year, month - 1, day),
          value: v["value"], // 라인그래프 기준 데이터
          compareValue: v["compareValue"] // 비교 데이터
        };
      }, []);

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
      const xMin = d3.min(filterData, d => {
        return d["date"];
      });

      const xMax = d3.max(filterData, d => {
        return d["date"];
      });

      const yMin = d3.min(filterData, d => {
        return Number(d["value"]);
      });

      const yMax = d3.max(filterData, d => {
        return Number(d["value"]);
      });

      // scale using range
      const xScale = d3.time
        .scale()
        .domain([xMin, xMax])
        .range([0, width]);

      const yScale = d3.scale
        .linear()
        .domain([yMin, yMax + yMax / 10])
        .range([height, 0]);

      // add chart SVG to the page
      const svg = d3
        .select(element)
        .append("svg")
        .attr("id", id)
        .attr("width", width + margin["left"] + margin["right"])
        .attr("height", height + margin["top"] + margin["bottom"])
        .append("g")
        .attr("transform", `translate(${margin["left"]}, ${margin["top"]})`);

      // create the axes component
      let xAxis = d3.svg
        .axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(that.dateFomat)
        .outerTickSize(1);

      let yAxis = d3.svg
        .axis()
        .scale(yScale)
        .innerTickSize(-width)
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
        .attr("font-size", "11px")
        .attr("dx", "2em")
        .attr("dy", "1em");

      svg
        .append("g")
        .attr("class", "y axis")
        .attr("font-size", "11px")
        .call(yAxis)
        .selectAll(".y .tick:not(:first-of-type) line")
        .attr("stroke", "#777")
        .attr("opacity", "0.2");

      const line = d3.svg
        .line()
        .x(d => xScale(d["date"]))
        .y(d => yScale(d["value"]));

      const movingAverageLine = d3.svg
        .line()
        .x(d => xScale(d["date"]))
        .y(d => yScale(d["average"]))
        .interpolate(d3.curveBasis);

      svg
        .append("path")
        .data([filterData]) // binds data to the line
        .style("fill", "none")
        .attr("id", "priceChart")
        .attr("stroke", "steelblue")
        .attr("stroke-width", "1.5")
        .attr("d", line);

      // calculates simple moving average over 50 days
      const movingAverageData = this.movingAverage(filterData, 49);
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
        .on("mouseenter", () => focus.style("display", null))
        .on("mouseleave", () => focus.style("display", "none"))
        .on("mousemove", generateCrosshair);

      d3.select(".overlay").style("fill", "none");
      d3.select(".overlay").style("pointer-events", "all");

      d3.selectAll(".focus line").style("fill", "none");
      d3.selectAll(".focus line").style("stroke", "#67809f");
      d3.selectAll(".focus line").style("stroke-width", "1.5px");
      d3.selectAll(".focus line").style("stroke-dasharray", "3 3");

      //returs insertion point
      const bisectDate = d3.bisector(d => d.date).left;

      /* mouseenter function to generate crosshair */
      function generateCrosshair() {
        //returns corresponding value from the domain
        const correspondingDate = xScale.invert(d3.mouse(this)[0]);
        //gets insertion point
        const i = bisectDate(filterData, correspondingDate, 1);
        const d0 = filterData[i - 1];
        const d1 = filterData[i];
        const currentPoint =
          correspondingDate - d0["date"] > d1["date"] - correspondingDate
            ? d1
            : d0;
        focus.attr(
          "transform",
          `translate(${xScale(currentPoint["date"])}, ${yScale(
            currentPoint["value"]
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
          .attr("y2", height - yScale(currentPoint["value"]));

        updateLegends(currentPoint);
      }

      /* Legends */
      const updateLegends = currentData => {
        d3.selectAll(".lineLegend").remove();

        const legendKeys = Object.keys(filterData[0]);
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
            if (d === "date") {
              return `${category[d]}: ${currentData[d].toLocaleDateString()}`;
            } else if (d === "value") {
              return `${category[d]}: ${that.numberWithCommas(
                currentData[d]
              )}원`;
            } else {
              return `${category[d]}: ${that.numberWithCommas(
                currentData[d]
              )}원`;
            }
          })
          .style("fill", "black")
          .attr("transform", "translate(15,9)"); //align texts with boxes
      };
    },

    /**
     * 날짜 fomat 설정
     */
    dateFomat(d) {
      var ff = d3.time.format("%m");
      return ff(d) + "월";
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
          return a + b["compareValue"];
        }, 0);

        return {
          date: row["date"],
          average: sum / subset.length
        };
      });
    }
  }
};
</script>

<style scoped>
.historical-pirce-component {
  color: #67809f;
  width: 100%;
  height: 100%;
  /* position: absolute; */
}

.historical-pirce-component >>> a {
  color: #67809f;
}

.historical-pirce-component >>> path.line {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}
.historical-pirce-component >>> .lineLegend text {
  font-size: 12px;
}
</style>
