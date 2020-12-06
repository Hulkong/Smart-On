<template>
  <div class="chart pyramid_container">
    <tooltip ref="tooltip"></tooltip>
    <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>
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
  </div>
</template>

<script>
import Tooltip from "@/components/chart-tooltip";
export default {
  // 컴포넌트 이름
  name: "pyramid",

  props: { options: Object },

  data() {
    return {
      cleanData: []
    };
  },

  components: {
    tooltip: Tooltip
  },

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

      const that = this;
      const element = this.$el;
      const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis
      const legendVal = chartOption.legend; // 범례 카테고리
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
      const totalPopulation = d3.sum(
        data,
        d => Number(d.male) + Number(d.female)
      );
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
        d3.max(data, d => Number(d.male)),
        d3.max(data, d => Number(d.female))
      );

      // SET UP SCALES
      // the xScale goes from 0 to the width of a region
      // it will be reversed for the left x-axis
      const xScale = d3.scale
        .linear()
        .domain([0, maxValue])
        .range([0, regionWidth])
        .nice();
      const yScale = d3.scale
        .ordinal()
        .domain(data.map(d => d.group))
        .rangeRoundBands([h, 0], 0.1);
      const yAxisLeft = d3.svg
        .axis() // SET UP AXES
        .scale(yScale)
        .orient("right")
        .ticks(5)
        .tickSize(4, 0)
        .tickPadding(margin.middle - 25);
      const yAxisRight = d3.svg
        .axis()
        .scale(yScale)
        .orient("left")
        .tickSize(4, 0)
        .tickPadding(margin.middle - 25);
      const xAxisRight = d3.svg
        .axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(w < 300 ? 2 : 3)
        .tickFormat(d => that.numberWithCommas(d) + "명");
      // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
      const xAxisLeft = d3.svg
        .axis()
        .scale(xScale.copy().range([pointA, 0]))
        .orient("bottom")
        .ticks(w < 300 ? 2 : 3)
        .tickFormat(d => {
          if (d > 0) return that.numberWithCommas(d) + "명";
        });
      // MAKE GROUPS FOR EACH SIDE OF CHART
      // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
      const leftBarGroup = svg
        .append("g")
        .attr("transform", this.translation(pointA, 0) + "scale(-1,1)");
      const rightBarGroup = svg
        .append("g")
        .attr("transform", this.translation(pointB, 0));
      const colors = ["#fbd14b", "#4d21bc"]; // 범례 색상

      // DRAW AXES
      svg
        .append("g")
        .attr("class", "axis y left")
        .attr("transform", this.translation(0, 0))
        .call(yAxisLeft)
        .selectAll("text")
        .style("text-anchor", "middle");

      svg
        .append("g")
        .attr("class", "axis y right")
        .attr("transform", this.translation(regionWidth * 2, 0))
        .call(yAxisRight)
        .selectAll("text")
        .style("text-anchor", "middle");

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
        .attr("width", d => xScale(d.male))
        .attr("height", yScale.rangeBand())
        .on("mouseenter", function(d) {
          const data = {
            title: legendVal[0],
            contents: [
              {
                name: d["group"].replace("-", "~") + "대",
                value: that.numberWithCommas(Number(d["male"])) + "명"
              }
            ],
            color: colors[0]
          };

          that.$refs["tooltip"].mouseenter(that.$el, data);
          d3.select(this).style("fill", "orange");
        })
        .on("mouseleave", function() {
          that.$refs["tooltip"].mouseleave(that.$el);
          d3.select(this).style("fill", "");
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
          if (d.female > 0) return xScale(d.female);
        })
        .attr("height", yScale.rangeBand())
        .on("mouseenter", function(d) {
          const data = {
            title: legendVal[1],
            contents: [
              {
                name: d["group"].replace("-", "~") + "대",
                value: that.numberWithCommas(Number(d["female"])) + "명"
              }
            ],
            color: colors[1]
          };

          that.$refs["tooltip"].mouseenter(that.$el, data);
          d3.select(this).style("fill", "orange");
        })
        .on("mouseleave", function() {
          that.$refs["tooltip"].mouseleave(that.$el);
          d3.select(this).style("fill", "");
        });

      /**
       * 범례 설정하는 로직
       */
      // const legend_tabs = [0, 70]; // 범례 x축 위치
      const legend_tabs = [w / 2 - 45, w / 2 + 5]; // 범례 x축 위치
      const legend = svg
        .selectAll(".legend")
        .data(legendVal)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(" + legend_tabs[i] + ",-15)");

      legend
        .append("rect")
        .attr("x", 0)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", (d, i) => colors[i]);

      legend
        .append("text")
        .attr("x", 15)
        .attr("y", 5)
        .attr("dy", ".35em")
        .style("text-anchor", "begin")
        .style("font-size", "11px")
        .text(function(d) {
          return d;
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
  font-size: 9px;
}

.pyramid_container >>> .bar {
  fill-opacity: 1;
}

.pyramid_container >>> .bar.left {
  /* fill: steelblue; */
  fill: #fbd14b;
}

.pyramid_container >>> .bar.right {
  fill: #4d21bc;
}
</style>