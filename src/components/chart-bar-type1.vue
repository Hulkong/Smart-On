<template>
  <div class="chart bar_container">
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
  name: "bar",

  props: { options: Object },

  data() {
    return {
      copyData: []
    };
  },

  components: {
    tooltip: Tooltip
  },

  created() {},

  mounted() {},

  // 뷰
  template: "",

  methods: {
    /**
     * @description 차트 그리는 함수
     * @param {Array} data 차트 데이터
     * @param {Object} options 차트 옵션
     */
    draw(data, options) {
      if (!data || data.length === 0) return; // 데이터가 없을 경우 리턴

      const chartOption = options.chartOption;
      const isXAxis = chartOption["isXAxis"];
      const isYAxis = chartOption["isYAxis"];
      const isXDomain = chartOption["isXDomain"];
      const isYDomain = chartOption["isYDomain"];
      const isShowTopText = chartOption["isShowTopText"]; // 그래프 최상단 라벨표시여부

      this.init(chartOption, data); // 해당 컴포넌트 설정값 초기화
      chartOption.chart = this.makeChart(chartOption); // 차트 컨테이너 생성

      if (isXAxis) this.makeXAxis(chartOption); // x축 그림
      if (isYAxis) this.makeYAxis(chartOption); // y축 그림
      if (isShowTopText) this.makeTopText(chartOption, data); // 막대차트 위 텍스트 출력

      this.makeBars(chartOption, data); // 막대차트 그림
    },

    /**
     * @description 해당 컴포넌트 필수 설정값 초기화하는 메소드
     * @param {Object} options 차트 옵션
     * @param {Array} data 차트 데이터
     */
    init(options, data) {
      const element = this.$el;
      const margin = options["margin"] || {
        top: 0,
        right: 0,
        bottom: 0,
        Zleft: 0
      };
      const ticks = options["ticks"] || 0;

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
        .rangeRoundBands([0, width], 0.5)
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
        .orient("bottom")
        .outerTickSize(0);

      // yAxis
      const yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-width)
        .ticks(ticks)
        .tickPadding(10);

      // 해당 컴포넌트 내의 전역변수 세팅
      options.width = width;
      options.height = height;
      options.xScale = xScale;
      options.yScale = yScale;
      options.xAxis = xAxis;
      options.yAxis = yAxis;
    },

    /**
     * @description 차트 컨테이너 생성하는 메소드
     * @param {Object} options  차트 옵션
     * @returns {Object} d3 Object
     */
    makeChart(options) {
      const element = this.$el;
      const id = options.dataId;
      const height = options.height;
      const width = options.width;
      const margin = options.margin;

      return d3
        .select(element)
        .append("div") // Container class to make it responsive.
        .append("svg")
        .attr("id", id)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    },

    /**
     * @description 복수의 막대차트 생성하는 메소드
     * @param {Object} options 차트 옵션
     * @param {Array} data 차트 데이터
     */
    makeBars(options, data) {
      const that = this;
      const element = this.$el;
      const chart = options.chart;
      const xScale = options.xScale;
      const yScale = options.yScale;
      const height = options.height;
      const fillColor = options.fillColor;

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
        .attr("width", 20)
        .style("fill", d => (d.color ? d.color : fillColor))
        .on("mouseenter", function(d) {
          const unit = options["unit"] || ""; // 마우스오버 팝업창 표시단위
          const data = {
            title: d["name"],
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

          tooltipDOM.style.left = x + "px";
          tooltipDOM.style.top = y + "px";
        })
        .on("mouseleave", function(d) {
          that.$refs["tooltip"].mouseleave(that.$el);
          d3.select(this).style("fill", d["color"]);
        });
    },

    /**
     * @description 막대차트 위 텍스트 생성하는 메소드
     * @param {Object} options 차트 옵션
     * @param {Array} data 차트 데이터
     */
    makeTopText(options, data) {
      const chart = options.chart;
      const xScale = options.xScale;
      const yScale = options.yScale;

      chart
        .selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "_top_label")
        .style("text-anchor", "start")
        .style("font-size", "11px")
        .attr("x", function(d) {
          return xScale(d.name);
        })
        .attr("y", function(d) {
          return yScale(d.value) - 10;
        })
        .attr("dy", ".75em")
        .text(function(d) {
          return d.topPositionValue;
        });
    },

    /**
     * @description 막대차트 X축 생성하는 메소드
     * @param {Object} options 차트 옵션
     */
    makeXAxis(options) {
      const chart = options.chart;
      const height = options.height;
      const xAxis = options.xAxis;
      const anchor = options.anchor;
      const fontSize = options.fontSize;
      const fontWeight = options.fontWeight;
      const rotate = options.rotate;
      const isRotate = options.isRotate;

      chart
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", anchor)
        .style("font-size", fontSize)
        .attr("transform", rotate)
        .attr("x", 0)
        .attr("y", () => (isRotate ? 10 : 15))
        .text(d => {
          let labelArr = d.split(" ");
          let label = d;
          if (isRotate) {
            label = labelArr[0];
          }

          return label;
        })
        .attr("font-weight", fontWeight)
        .attr("dx", "-1em")
        // .attr("dy", "1.5em")
        // .attr("dy", "-.55em")
        .append("tspan")
        .text(d => {
          let labelArr = d.split(" ");
          let label = "";
          if (isRotate) {
            if (labelArr.length > 0) {
              labelArr.reduce((acc, v, i) => {
                if (i > 0) {
                  label += v;
                }
              });
            }
          }

          return label;
        })
        .attr("x", "-10")
        .attr("y", 30);
    },

    /**
     * @description 막대차트 X축 생성하는 메소드
     * @param {Object} options 차트 옵션
     */
    makeYAxis(options) {
      const chart = options.chart;
      const yAxis = options.yAxis;
      const isYDomain = options.isYDomain;

      chart
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .select(".domain")
        .style("display", () => (isYDomain ? "block" : "none"));
    },

    /**
     * @description 차트 컨테이너 삭제하는 메소드
     */
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
.bar_container {
  position: relative;
  width: 100%;
  height: 100%;
}

.bar_container >>> rect {
  fill: #4d21bc;
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
</style>