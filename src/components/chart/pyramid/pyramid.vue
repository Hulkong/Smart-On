<template>
  <div class="chart pyramid_container">
    <div class="tooltip hidden"></div>
  </div>
</template>

<script>
export default {
  // 컴포넌트 이름
  name: "pyramid",

  props: { options: Object },

  data() {
    return {};
  },

  beforeMount() {},

  created() {},

  mounted() {},

  // 뷰
  template: "",

  // 액션
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

      // SET UP DIMENSIONS
      const w =
        Number(
          d3
            .select(element)
            .style("width")
            .replace("px", "")
        ) -
        margin.left -
        margin.right;
      const h =
        Number(
          d3
            .select(element)
            .style("height")
            .replace("px", "")
        ) -
        margin.top -
        margin.bottom;
      // the width of each side of the chart
      const regionWidth = w / 2 - margin.middle;
      // these are the x-coordinates of the y-axes
      const pointA = regionWidth;
      const pointB = w - regionWidth;
      // GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
      const totalPopulation = d3.sum(data, d => d.male + d.female);
      const percentage = d => d / totalPopulation;
      // CREATE SVG
      const svg = d3
        .select(element)
        .append("svg")
        .attr("id", id)
        .attr("width", margin.left + w + margin.right) // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
        .attr("height", margin.top + h + margin.bottom)
        .append("g")
        .attr("transform", this.translation(margin.left, margin.top));
      // find the maximum data value on either side since this will be shared by both of the x-axes
      const maxValue = Math.max(
        d3.max(data, d => percentage(d.male)),
        d3.max(data, d => percentage(d.female))
      );
      // SET UP SCALES
      // the xScale goes from 0 to the width of a region
      // it will be reversed for the left x-axis
      const xScale = d3.scale
        .linear()
        .domain([0, maxValue])
        .range([0, regionWidth])
        .nice();
      const xScaleLeft = d3.scale
        .linear()
        .domain([0, maxValue])
        .range([regionWidth, 0]);
      const xScaleRight = d3.scale
        .linear()
        .domain([0, maxValue])
        .range([0, regionWidth]);
      const yScale = d3.scale
        .ordinal()
        .domain(data.map(d => d.group))
        .rangeRoundBands([h, 0], 0.1);
      const yAxisLeft = d3.svg
        .axis() // SET UP AXES
        .scale(yScale)
        .orient("right")
        .tickSize(4, 0)
        .tickPadding(margin.middle - 4);
      const yAxisRight = d3.svg
        .axis()
        .scale(yScale)
        .orient("left")
        .tickSize(4, 0)
        .tickFormat("");
      const xAxisRight = d3.svg
        .axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(d3.format("%"));
      // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
      const xAxisLeft = d3.svg
        .axis()
        .scale(xScale.copy().range([pointA, 0]))
        .orient("bottom")
        .tickFormat(d3.format("%"));
      // MAKE GROUPS FOR EACH SIDE OF CHART
      // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
      const leftBarGroup = svg
        .append("g")
        .attr("transform", this.translation(pointA, 0) + "scale(-1,1)");
      const rightBarGroup = svg
        .append("g")
        .attr("transform", this.translation(pointB, 0));

      // DRAW AXES
      svg
        .append("g")
        .attr("class", "axis y left")
        .attr("transform", this.translation(pointA, 0))
        .call(yAxisLeft)
        .selectAll("text")
        .style("text-anchor", "middle");

      svg
        .append("g")
        .attr("class", "axis y right")
        .attr("transform", this.translation(pointB, 0))
        .call(yAxisRight);

      svg
        .append("g")
        .attr("class", "axis x left")
        .attr("transform", this.translation(0, h))
        .call(xAxisLeft);

      svg
        .append("g")
        .attr("class", "axis x right")
        .attr("transform", this.translation(pointB, h))
        .call(xAxisRight);

      // DRAW BARS
      leftBarGroup
        .selectAll(".bar.left")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar left")
        .attr("x", 0)
        .attr("y", d => yScale(d.group))
        .attr("width", d => xScale(percentage(d.male)))
        .attr("height", yScale.rangeBand())
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "orange");

          const width = d3.select(this).attr("width"),
            startX = parseFloat(pointA - width),
            xPosition = startX + width / 2,
            yPosition = parseFloat(d3.select(this).attr("y"));

          d3.select(".tooltip")
            .style({
              left: xPosition + "px",
              top: yPosition + "px"
            })
            .text(d["group"] + " : " + d["male"]);

          d3.select(".tooltip").classed("hidden", false);
        })
        .on("mouseout", function() {
          d3.select(this).style("fill", "");
          d3.select(".tooltip").classed("hidden", true);
        });

      rightBarGroup
        .selectAll(".bar.right")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar right")
        .attr("x", 0)
        .attr("y", d => yScale(d.group))
        .attr("width", d => {
          if (d.female > 0) return xScale(percentage(d.female));
        })
        .attr("height", yScale.rangeBand())
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "orange");

          const width = parseFloat(d3.select(this).attr("width")),
            xPosition = pointB + width / 2,
            yPosition = parseFloat(d3.select(this).attr("y"));

          d3.select(".tooltip")
            .style({
              left: xPosition + "px",
              top: yPosition + "px"
            })
            .text(d["group"] + " : " + d["female"]);

          d3.select(".tooltip").classed("hidden", false);
        })
        .on("mouseout", function() {
          d3.select(this).style("fill", "");
          d3.select(".tooltip").classed("hidden", true);
        });
    },

    // so sick of string concatenation for translations
    translation: (x, y) => "translate(" + x + "," + y + ")",

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      d3.select(this.$el)
        .select("svg")
        .remove();
    }
  }
};
</script>

<style scoped>
.pyramid_container {
  position: relative;
  width: 100%;
  height: 100%;
}

.pyramid_container >>> .axis line,
.pyramid_container >>> .axis path {
  shape-rendering: crispEdges;
  fill: transparent;
  stroke: #555;
}

.pyramid_container >>> .axis text {
  font-size: 11px;
}

.pyramid_container >>> .bar {
  fill-opacity: 0.5;
}

.pyramid_container >>> .bar.left {
  fill: steelblue;
}

.pyramid_container >>> .bar.right {
  fill: firebrick;
}

.pyramid_container >>> .tooltip {
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
}

.pyramid_container >>> .tooltip.hidden {
  display: none;
}
</style>