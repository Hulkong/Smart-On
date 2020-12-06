<template>
  <div class="chart line_container">
    <tooltip ref="tooltip"></tooltip>
    <!-- 로딩 이미지 -->
    <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>
    <!-- //로딩 이미지 -->
    <!-- 기본이미지 -->
    <div class="_default_image">
      <v-img
        contain
        width="50%"
        height="50%"
        class="_image"
        :src="getImageUrl('common/img_ready.png')"
        alt
      />
      <p class="_text">준비중입니다.</p>
    </div>
    <!-- //기본이미지 -->
  </div>
</template>

<script>
import Tooltip from "@/components/chart-tooltip";
export default {
  // 컴포넌트 이름
  name: "linechart",
  props: { options: Object },
  data: function() {
    return {
      chartData: []
    };
  },

  components: {
    tooltip: Tooltip
  },

  created: function() {},

  mounted: function() {},

  // 뷰
  template: "",

  // 액션
  methods: {
    /**
     * @description d3차트를 그리는 메소드
     * @param {String: id} 컴포넌트 아이디
     */
    draw: function(data, options) {
      const that = this;
      if (!data || data.length === 0) return; // 데이터가 없을 경우 리턴
      // vue 컴포넌트 내장 데이터
      let chartData = data;
      let chartOption = options.chartOption;

      const width =
        Number(
          d3
            .select(this.$el)
            .style("width")
            .replace("px", "")
        ) -
        chartOption.margin.left -
        chartOption.margin.right;
      const height =
        Number(
          d3
            .select(this.$el)
            .style("height")
            .replace("px", "")
        ) -
        chartOption.margin.top -
        chartOption.margin.bottom;

      let yScale = d3.scale.linear().range([height, 0]);
      let domain = chartOption.setDomain(data);
      let xScale = d3.time
        .scale()
        .domain(domain)
        .range([0, width]);
      let yMaxValue = d3.max(chartData, function(d) {
        return d.value;
      });

      let numberOfTicks = chartOption.ticks;
      let xAxisGrid = d3.svg
        .axis()
        .scale(xScale)
        .ticks(numberOfTicks)
        .tickSize(-height, 0)
        .tickFormat("")
        .orient("top");

      //axis
      let xAxis = d3.svg
        .axis()
        .scale(xScale)
        .tickFormat(chartOption.tickFormat)
        .ticks(d3.time.month);
      // .tickFormat(chartOption.xAxisformat);

      let yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-width)
        .ticks(chartOption.ticks)
        .tickPadding(10)
        .tickFormat(function(d) {
          let ff = d3.format(",");
          return ff(Number(d));
        });

      let line = d3.svg
        .line()
        .x(function(d) {
          return xScale(that.formatYYYYMMDDToDate(d.name));
        })
        .y(function(d) {
          return yScale(d.value);
        });

      let svg = d3
        .select(this.$el)
        .append("svg")
        .attr(
          "width",
          width + chartOption.margin.left + chartOption.margin.right
        )
        .attr(
          "height",
          height + chartOption.margin.top + chartOption.margin.bottom
        )
        .append("g")
        .attr(
          "transform",
          "translate(" +
            chartOption.margin.left +
            "," +
            chartOption.margin.top +
            ")"
        );

      yScale.domain([0, yMaxValue + yMaxValue / 8]).nice();
      // xScale.domain(
      //   chartData.map(function(d) {
      //     return that.formatYYYYMMDDToDate(d.name);
      //   })
      // );

      //datum :
      svg.datum(chartData);

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", chartOption.fontSize)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

      svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .style("font-size", chartOption.fontSize)
        .call(yAxis);

      svg
        .append("g")
        .classed("x", true)
        .classed("grid", true)
        .call(xAxisGrid);

      let linePath = svg
        .append("path")
        .attr("class", "line")
        .attr("d", line);

      let totalLength = linePath.node().getTotalLength();
      linePath
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);

      svg
        .selectAll("dot")
        .data(chartData)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
          return xScale(that.formatYYYYMMDDToDate(d.name));
        })
        .attr("cy", function(d) {
          return yScale(d.value);
        })
        .on("mouseenter", function(d) {
          const unit = chartOption["unit"] || ""; // 마우스오버 팝업창 표시단위
          const value =
            d["value"] != null ? that.numberWithCommas(d["value"]) : "-";
          const data = {
            title: chartOption.tooltipFormat(d["name"]),
            contents: [
              {
                name: "value",
                value: that.numberWithCommas(d["value"]) + unit
              }
            ],
            color: d["color"]
          };

          that.$refs["tooltip"].mouseenter(that.$el, data);

          const tooltipDOM = that.$el.getElementsByClassName("_tooltip")[0];
          const rectX = this.getBoundingClientRect().x;
          const rectY = this.getBoundingClientRect().y;
          const rectWidth = this.getBoundingClientRect().width;
          const tooltipWidth = tooltipDOM.getBoundingClientRect().width;
          const tooltipHeight = tooltipDOM.getBoundingClientRect().height;
          const x = rectX - tooltipWidth / 2 + rectWidth / 2;
          const y = rectY - tooltipHeight - 10;

          d3.select(this).style("fill", "orange");
          d3.select(this).attr("r", "5");

          tooltipDOM.style.left = x + "px";
          tooltipDOM.style.top = y + "px";
        })
        .on("mouseleave", function(obj) {
          that.$refs["tooltip"].mouseleave(that.$el);
          d3.select(this).style("fill", "#0266FF");
          d3.select(this).attr("r", "2");
        });
    },
    // svg 삭제하는 메소드
    remove() {
      // 차트 삭제
      d3.select(this.$el)
        .select("svg")
        .remove();
    }
  }
};
</script>

<style scoped>
.line_container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 650;
}

.line_container >>> .axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.line_container >>> .y.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.line_container >>> .y.axis .tick line {
  stroke: lightgrey;
  opacity: 0.7;
}

.line_container >>> g circle {
  fill: transparent;
  /* stroke: #16873c; */
  /* stroke-width: 2px; */
}

.line_container >>> g path.line {
  stroke: #0266ff;
  stroke-width: 5px;
  stroke-opacity: 1;
  fill: none;
}

.line_container >>> div.tooltip {
  position: absolute;
  text-align: center;
  width: 90px;
  height: 30px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}

.line_container >>> .grid .tick {
  stroke: lightgrey;
  opacity: 0.7;
}

.line_container >>> .grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  stroke-dasharray: 3;
}

.line_container >>> .grid path {
  stroke-width: 0;
}
</style>