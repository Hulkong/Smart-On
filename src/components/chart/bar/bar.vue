<template>
  <div class="chart bar_container">
    <div class="tooltip hidden"></div>
  </div>
</template>
<script>
export default {
  name: "bar",

  props: { options: Object },

  data: function() {
    return {};
  },

  created: function() {},

  mounted: function() {},

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

      // vue 컴포넌트 내장 데이터
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
        margin.right;

      const height =
        Number(
          d3
            .select(element)
            .style("height")
            .replace("px", "")
        ) -
        margin.top -
        margin.bottom;

      // xScale
      const xScale = d3.scale
        .ordinal()
        .rangeRoundBands([0, width], 0.05)
        .domain(data.map(d => d.name));

      const yMax = d3.max(data, d => d.value); // y의 최대값
      const yScale = d3.scale
        .linear()
        .range([height, 0])
        .domain([0, yMax + yMax / 10]);

      // xAxis
      const xAxis = d3.svg
        .axis()
        .scale(xScale)
        .orient("bottom");

      //
      const yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-width)
        .ticks(ticks)
        .tickPadding(10);

      const chart = d3
        .select(element)
        .append("div") // Container class to make it responsive.
        .append("svg")
        .attr("id", id)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // x Axis
      if (isxAxis) {
        chart
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height + 20) + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .text(d => {
            let t = d;
            if (d.length > 2) {
              t = d.substr(0, 2);
            }
            return t;
          })
          .attr("font-size", 14)
          .attr("font-weight", 400)
          .attr("dx", "1em")
          .attr("dy", "-.55em")
          .append("tspan")
          .text(d => {
            if (d.length > 2) {
              return d.substr(2, 5);
            }
          })
          .attr("x", 20)
          .attr("y", 20);
        // .attr("transform", "rotate(-45)");
      }

      // y Axis
      if (isyAxis) {
        chart
          .append("g")
          .attr("class", "y axis")
          .call(yAxis);
      }

      // draw column
      chart
        .selectAll(".bar_container")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.value))
        .attr("height", d => {
          const h = height - yScale(d.value);

          if (h > 0) return h;
        })
        .attr("width", xScale.rangeBand())
        .style("fill", () =>
          chartOption.fillColor ? chartOption.fillColor : ""
        )
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "orange");
          const x = parseFloat(d3.select(this).attr("x"));
          const y = xScale.rangeBand() / 2;
          const xPosition = x + y;
          const yPosition =
            parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

          d3.select(element)
            .select(".tooltip")
            .style({
              left: xPosition + "px",
              top: yPosition + "px"
            })
            .text(d["name"] + " : " + d["value"]);

          d3.select(element)
            .select(".tooltip")
            .classed("hidden", false);
        })
        .on("mouseout", function(d) {
          d3.select(this).style(
            "fill",
            chartOption.fillColor ? chartOption.fillColor : ""
          );
          d3.select(element)
            .select(".tooltip")
            .classed("hidden", true);
        });
    },

    // 차트 삭제하는 메소드
    remove: function() {
      // 차트 삭제
      d3.select(this.$el)
        .select("svg")
        .remove();
    }
  }
};
</script>
<style scoped>
.bar_container {
  width: 100%;
  height: 100%;
  position: absolute;
}

.bar_container >>> .axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar_container >>> .y.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar_container >>> .guideline {
  stroke-width: 1;
  shape-rendering: crispEdges;
}

.bar_container >>> .y.axis .tick line {
  stroke: lightgrey;
  opacity: 0.7;
}

.bar_container >>> .x.axis .domain {
  display: none;
}

.bar_container >>> .tooltip {
  position: absolute;
  height: auto;
  padding: 10px;
  background-color: white;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 1;
}

.bar_container >>> .tooltip.hidden {
  display: none;
}
</style>