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

      const chartOptions = this.init(options.chartOption);
      const width =
        Number(
          d3
            .select(this.$el)
            .style("width")
            .replace("px", "")
        ) -
        chartOptions.containerMargin.left -
        chartOptions.containerMargin.right;

      const height =
        Number(
          d3
            .select(this.$el)
            .style("height")
            .replace("px", "")
        ) -
        chartOptions.containerMargin.top -
        chartOptions.containerMargin.bottom;

      d3.select(this.$el)
        .datum(data)
        .call(
          this.createChart(chartOptions)
            .width(width)
            .height(height)
        );
    },

    /**
     * @description 필요 설정 값 세팅
     * @param {Object} obtions 차트 설정값
     * containerMargin: 컨테이너 마진
     *  - top, right, bottom, left
     * margin: 차트 마진
     *  - top, right, bottom, left
     * xAxis: x축
     *  - isShow: 보임 / 숨김 여부
     *  - position: 축 위치
     *  - rotate: 축 내부 text 각도
     * yAxis: y축
     *  - isShow: 보임 / 숨김 여부
     *  - position: 축 위치
     *  - rotate: 축 내부 text 각도
     * zeroAxis: y === 0 인 y축
     *  - isShow: 보임 / 숨김 여부
     *  - rotate: 축 내부 text 각도
     * tickSize: tick 개수
     * text: text 옵션
     *  - size: font-size
     *  - weight: font-weight
     * topText: 막대차트 위 text
     *  - isShow: 보임 / 숨김 여부
     * unit: 표현 단위
     * element: 현재 컴포넌트에 바인딩된 DOM
     * xRoundBands: ???
     * xScale: x값 범위
     * yScale: y값 범위
     * barWidth: bar 넓이
     * @returns {Object} 차트 옵션
     */
    init(options) {
      return {
        containerMargin: options["containerMargin"] || {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        margin: options["margin"] || {
          top: 30,
          right: 10,
          bottom: 50,
          left: 50
        },
        xAxis: options["xAxis"] || {
          isShow: true,
          position: "bottom",
          rotate: ""
        },
        yAxis: options["yAxis"] || {
          isShow: true,
          position: "left",
          rotate: ""
        },
        zeroAxis: options["zeroAxis"] || {
          isShow: true,
          rotate: ""
        },
        tickSize: options["tickSize"] || 0,
        text: options["text"] || {
          size: "12px",
          weight: 400,
          unit: "원"
        },
        topText: options["topText"] || {
          isShow: false,
          unit: "%"
        },
        unit: options["unit"] || "",
        element: this.$el,
        xRoundBands: options["xRoundBands"] || 0.2,
        xScale: d3.scale.ordinal(),
        yScale: d3.scale.linear(),
        barWidth: options["barWidth"] || xScale.rangeBand()
      };
    },

    /**
     * @description 차트 생성하는 메소드
     * @param {Object} options 차트 옵션
     */
    createChart(options) {
      const that = this;
      const element = options.element;
      const xRoundBands = options.xRoundBands;
      const xScale = options.xScale;
      const yScale = options.yScale;
      const barWidth = options.barWidth;
      const tickSize = options.tickSize;
      const yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient(options.yAxis.position);
      const xAxis = d3.svg.axis().scale(xScale);
      let data = [];
      let margin = options.margin;
      let width = 450;
      let height = 450;
      let svg = null;
      let g = null;

      function chart(selection) {
        selection.each(function(chartData) {
          data = chartData;
          const XYs = data.map((d, i) => [d["name"], d["rate"]]); // XY 배열
          const negativeValues = data.filter(item => item["rate"] < 0); // 음수 표함 여부

          // 음수가 포함여부에 따른 차트 margin 조정
          if (negativeValues.length > 0) {
            margin.bottom = 35;
          } else {
            margin.bottom = 60;
          }

          // Update the x-scale.
          xScale
            .domain(
              XYs.map(function(d) {
                return d[0];
              })
            )
            .rangeRoundBands(
              [0, width - margin.left - margin.right],
              xRoundBands
            );

          // Update the y-scale.
          yScale
            .domain(
              d3.extent(
                XYs.map(function(d) {
                  return d[1];
                })
              )
            )
            .range([height - margin.top - margin.bottom, 0])
            .nice();

          makeSVG(); // svg 생성

          makeGs(); // g 태그 생성

          // Update the outer dimensions.
          svg.attr("width", width).attr("height", height);

          // Update the inner dimensions.
          updateG();

          // Update the bars.
          makeBars(data);

          // x축 업데이트
          if (options.xAxis.isShow) updateXAxis();

          //  y축 업데이트
          if (options.yAxis.isShow) updateYAxis();

          // 제로축 업데이트
          if (options.zeroAxis.isShow) updateZeroAxis();

          // bar 위 text 생성
          if (options.topText.isShow) makeTopText();
        });
      }

      /**
       * @description SVG 생성 메소드
       */
      function makeSVG() {
        svg = d3
          .select(that.$el)
          .selectAll("svg")
          .data([data]);
      }

      /**
       * @description G태그 생성 메소드
       */
      function makeGs() {
        const gEnter = svg
          .enter()
          .append("svg")
          .append("g");
        gEnter.append("g").attr("class", "bars");
        gEnter.append("g").attr("class", "y axis");
        gEnter.append("g").attr("class", "x axis");
        gEnter.append("g").attr("class", "x axis zero");
        gEnter.append("g").attr("class", "x axis top");
      }

      /**
       * @description G태그 업데이트 메소드
       */
      function updateG() {
        g = svg
          .select("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );
      }

      /**
       * @description x축 업데이트 메소드
       */
      function updateXAxis() {
        g.select(".x.axis")
          .attr(
            "transform",
            "translate(0," + (height - margin.top - margin.bottom) + ")"
          )
          .call(xAxis.orient(options.xAxis.position))
          .selectAll("text")
          .attr("transform", options.xAxis.rotate)
          .style("font-size", options.text.size)
          .style("font-weight", options.text.weight);
      }

      /**
       * @description y축 업데이트 메소드
       */
      function updateYAxis() {
        g.select(".y.axis")
          .call(yAxis)
          .style("font-size", options.text.size)
          .style("font-weight", options.text.weight);
      }

      /**
       * @description 제로축 업데이트 메소드
       */
      function updateZeroAxis() {
        g.select(".x.axis.zero")
          .attr("transform", "translate(-14," + Y0() + ")")
          .call(xAxis.tickSize(tickSize))
          .selectAll("text")
          .attr("transform", options.zeroAxis.rotate)
          .style("text-anchor", "middle")
          .attr("x", (d, i) => (Number(data[i]["rate"]) >= 0 ? -11 : 11))
          .attr("y", (d, i) => (Number(data[i]["rate"]) >= 0 ? 18 : -28))
          .style("font-size", options.text.size)
          .style("font-weight", options.text.weight);
      }

      /**
       * @description 막대차트 위 텍스트 생성하는 메소드
       */
      function makeTopText() {
        g.select(".x.axis.top")
          .selectAll(".text")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "_top_label")
          .style("text-anchor", "middle")
          .style("font-size", "11px")
          .attr("x", function(d) {
            return xScale(d.name) + 10;
          })
          .attr("y", (d, i) =>
            Number(d.rate) >= 0 ? yScale(d.rate) - 13 : yScale(d.rate) + 5
          )
          .attr("dy", ".75em")
          .text(function(d) {
            return d.rate + options.topText.unit;
          });
      }

      /**
       * @description bar 생성 메소드
       */
      function makeBars() {
        const bar = svg
          .select(".bars")
          .selectAll(".bar")
          .data(data);
        bar.enter().append("rect");
        bar.exit().remove();
        bar
          .attr("class", function(d, i) {
            return d["rate"] < 0 ? "bar negative" : "bar positive";
          })
          .attr("x", function(d) {
            return X(d);
          })
          .attr("y", function(d, i) {
            return d["rate"] < 0 ? Y0() : Y(d);
          })
          .attr("width", barWidth)
          .attr("height", function(d, i) {
            return Math.abs(Y(d) - Y0());
          })
          .style("fill", d => d.color || "")
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
      }

      // The x-accessor for the path generator; xScale ∘ xValue.
      function X(d) {
        return xScale(d["name"]);
      }

      function Y0() {
        return yScale(0);
      }

      // The x-accessor for the path generator; yScale ∘ yValue.
      function Y(d) {
        return yScale(d["rate"]);
      }

      chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
      };

      chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
      };

      chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
      };

      return chart;
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

.bar_container >>> .chart rect {
  stroke: white;
  fill-opacity: 0.6;
  fill: steelblue;
}

.bar_container >>> .bar.positive {
  fill: steelblue;
}

.bar_container >>> .bar.negative {
  fill: brown;
}

.bar_container >>> .axis text {
  font: 10px sans-serif;
}

.bar_container >>> .axis path,
.bar_container >>> .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
</style>