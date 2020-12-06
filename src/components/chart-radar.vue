<template>
  <div class="chart radar">
    <tooltip ref="tooltip"></tooltip>
    <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>
    <div class="_default_image">
      <v-img
        contain
        width="35%"
        height="35%"
        class="_image"
        :src="getImageUrl('common/img_ready.png')"
        alt
      />
      <p class="_text">준비중입니다.</p>
    </div>
    <div class="_legend">
      <div v-for="(item, index) in legendCheckboxs" :key="item.key">
        <input
          type="checkbox"
          :checked="item.isChecked"
          :value="index"
          @change="clickLegendCheckbox"
        />
        <div class="_box" :style="{backgroundColor: item.backgroundColor,}"></div>
        <span class="r_legend">{{ item.name }}</span>
      </div>
    </div>
    <div class="_real_container"></div>
    <div class="_fake_container"></div>
  </div>
</template>
<script>
import Tooltip from "@/components/chart-tooltip";
export default {
  name: "radar",

  props: {
    options: Object
  },

  data() {
    return {
      cleanData: [], // 정제된 데이터
      tooltipXY: [],
      legendCheckboxs: []
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
      const chartOption = options["chartOption"];

      this.cleanData = data;
      this.init(chartOption); // 초기 설정값 세팅
      this.makeSVG(chartOption); // 차트 컨테이너 생성
      this.makeAxis(chartOption); // 축 생성
      this.makeSpiderLine(chartOption); // 거미줄 라인 생성
      this.makeRadar(chartOption); // 방사차트 생성
      this.makeToolTip(chartOption); // 툴팁 생성
      this.makeFakeAxis(chartOption); // 가짜 축 생성
      // this.makeLegendType1(chartOption); // 범례 생성
      this.makeLegendType2(chartOption); // 범례 생성
    },

    /**
     * @description 초기 설정값 세팅하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    init(options) {
      const that = this;
      const cleanData = this.cleanData["chartData"];
      const margin = options.margin;
      const width =
        Number(
          d3
            .select(".radar")
            .style("width")
            .replace("px", "")
        ) -
        margin.left -
        margin.right;
      const height =
        Number(
          d3
            .select(".radar")
            .style("height")
            .replace("px", "")
        ) -
        margin.top -
        margin.bottom;

      const total = this.cleanData["axisData"].length;
      const radius = options.factor * Math.min(width / 2, height / 2);
      const Format = d => that.numberWithCommas(Math.floor(d));

      options.width = width;
      options.height = height;
      options.total = total;
      options.radius = radius;
      options.Format = Format;
    },

    /**
     * @description 차트 컨테이너 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeSVG(options) {
      const element = this.$el;
      const id = this.$dataId;
      const width = options.width;
      const height = options.height;
      const margin = options.margin;

      options.chart = d3
        .select(element)
        .select("._real_container")
        .append("svg")
        .attr("id", id)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    },

    /**
     * @description
     */
    makeLegendType2(options) {
      const data = this.cleanData["chartData"];
      const color = options.color;
      const drawOrder = options.drawOrder;
      const isShow = options.isShow;
      let arr = this.legendCheckboxs;

      arr.splice(0);

      data.reduce((acc, v, i) => {
        arr.push({
          key: new Date() + i,
          name: v[0]["colnm"],
          backgroundColor: color(i),
          isChecked: isShow(i) ? "checked" : ""
        });
      }, []);
    },

    clickLegendCheckbox() {
      const element = this.$el;
      const options = this.options.chartOption;
      const polygonOpacity = options.polygonOpacity;
      const pointOpacity = options.pointOpacity;
      const isChecked = event.target.checked;
      const index = event.target.value;
      const targets = d3
        .select(element)
        .selectAll(".radar-chart-serie" + index);

      if (isChecked) {
        targets
          .transition(200)
          .style("fill-opacity", function(d, i) {
            if (this.nodeName.toLowerCase() === "polygon") {
              return polygonOpacity(index);
            } else {
              return pointOpacity(index);
            }
          })
          .style("stroke-opacity", 1);
      } else {
        targets
          .transition(200)
          .style("fill-opacity", 0)
          .style("stroke-opacity", 0);
      }
    },

    /**
     * @description 범례 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeLegendType1(options) {
      const element = this.$el;
      const chart = options.chart;
      const margin = options.margin;
      const color = options.color;
      const polygonOpacity = options.polygonOpacity;
      const pointOpacity = options.pointOpacity;
      const drawOrder = options.drawOrder;
      const isShow = options.isShow;
      const titles = [];
      const cleanData = this.cleanData["chartData"];

      const legend = d3
        .select(element)
        .select("._fake_container")
        .select("svg")
        .append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr(
          "transform",
          "translate(" + margin.left / 2.5 + "," + margin.top / 2.5 + ")"
        );

      cleanData.reduce((acc, v, i) => {
        titles.push(v[0]["colnm"]);
      }, []);

      //범례 색박스
      legend
        .selectAll("circle")
        .data(titles)
        .enter()
        .append("circle")
        .attr("class", (d, i) => {
          if (isShow(i)) {
            return "_legend_circle on";
          } else {
            return "_legend_circle";
          }
        })
        .attr("cx", 0)
        .attr("cy", (d, i) => i * 25 + 7)
        .attr("r", 7)
        .style("fill", "black")
        .style("fill-opacity", (d, i) => (isShow(i) ? 1 : 0))
        .style("stroke", "black")
        .style("stroke-width", 1.7)
        .on("click", function(d, i) {
          const isActive = d3.select(this).classed("on");
          const targets = d3
            .select(element)
            .selectAll(".radar-chart-serie" + i);

          if (isActive) {
            d3.select(this)
              .classed("on", false)
              .style("fill-opacity", 0);
            targets
              .transition(200)
              .style("fill-opacity", 0)
              .style("stroke-opacity", 0);
          } else {
            d3.select(this)
              .classed("on", true)
              .style("fill-opacity", 1);
            targets
              .transition(200)
              .style("fill-opacity", function(d, i) {
                if (this.nodeName.toLowerCase() === "polygon") {
                  return polygonOpacity(i);
                } else {
                  return pointOpacity(i);
                }
              })
              .style("stroke-opacity", 1);
          }
        });

      //범례 색박스
      legend
        .selectAll("rect")
        .data(titles)
        .enter()
        .append("rect")
        .attr("x", 15)
        .attr("y", (d, i) => i * 25)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", (d, i) => color(i));

      //범례 text
      legend
        .selectAll("text")
        .data(titles)
        .enter()
        .append("text")
        .attr("class", "r_legend")
        .attr("x", 20 + 15)
        .attr("y", (d, i) => i * 25 + 12)
        .attr("fill", "#737373")
        .text(d => d);
    },

    /**
     * @description 축 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeAxis(options) {
      const that = this;
      const chart = options.chart;
      const width = options.width;
      const height = options.height;
      const radius = options.radius;
      const radians = options.radians;
      const factor = options.factor;
      const total = options.total;
      const factorLegend = options.factorLegend;
      const axisData = this.cleanData["axisData"];

      const axis = chart
        .selectAll(".axis")
        .data(axisData)
        .enter()
        .append("g")
        .attr("class", "axis");

      axis
        .append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr(
          "x2",
          // x축 전환
          (d, i) => {
            return (
              width / 2 + radius * factor * Math.sin((i * radians) / total)
            );
          }
        )
        .attr("y2", (d, i) => {
          // y축 전환
          return height / 2 - radius * factor * Math.cos((i * radians) / total);
        })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

      axis
        .append("text")
        .attr("class", "radar_legend")
        .text(d => d.name)
        .style("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("dy", (d, i) => {
          const degree =
            radius * factorLegend * Math.cos((i * radians) / total) -
            60 * Math.cos((i * radians) / total); // 기울기
          const floor = Math.floor(degree / 10); // 내림

          // 양수일 경우
          if (floor > 0) {
            return "-1em";
          }
        })
        .attr("transform", (d, i) => {
          const degree =
            radius * factorLegend * Math.sin((i * radians) / total) -
            60 * Math.sin((i * radians) / total); // 기울기
          const floor = Math.floor(degree / 10); // 내림
          const abs = Math.abs(floor); // 절대값
          let x = floor > 0 ? abs : -abs; // 양/음 구분

          return "translate(" + -x + ", 0)";
        })
        .attr("x", (d, i) => {
          // x축 전환
          return (
            width / 2 +
            radius * factorLegend * Math.sin((i * radians) / total) +
            60 * Math.sin((i * radians) / total)
          );
        })
        .attr("y", (d, i) => {
          // y축 전환
          return (
            height / 2 -
            radius * Math.cos((i * radians) / total) -
            20 * Math.cos((i * radians) / total)
          );
        })
        .append("tspan")
        .text(d => `${this.changeWonUnit(d.bud)}(${d.rate}%)`)
        .attr("x", (d, i) => {
          // x축 전환
          return (
            width / 2 +
            radius * factorLegend * Math.sin((i * radians) / total) +
            60 * Math.sin((i * radians) / total)
          );
        })
        .attr("dy", "1.5em");
    },

    /**
     * @description 거미줄 라인 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeSpiderLine(options) {
      const chart = options.chart;
      const levels = options.levels;
      const factor = options.factor;
      const radius = options.radius;
      const radians = options.radians;
      const total = options.total;
      const width = options.width;
      const height = options.height;
      const axisData = this.cleanData["axisData"];

      // 범위 혹은 눈금을 알려주는 바탕 도형
      for (let j = 0; j < levels - 1; j++) {
        let levelFactor = factor * radius * ((j + 1) / levels);
        chart
          .selectAll(".levels")
          .data(axisData)
          .enter()
          .append("svg:line")
          .attr("x1", (d, i) => {
            return levelFactor * (1 - factor * Math.sin((i * radians) / total));
          })
          .attr("y1", (d, i) => {
            return levelFactor * (1 - factor * Math.cos((i * radians) / total));
          })
          .attr("x2", (d, i) => {
            return (
              levelFactor * (1 - factor * Math.sin(((i + 1) * radians) / total))
            );
          })
          .attr("y2", (d, i) => {
            return (
              levelFactor * (1 - factor * Math.cos(((i + 1) * radians) / total))
            );
          })
          .attr("class", "line")
          .style("stroke", "grey")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "0.3px")
          .attr(
            "transform",
            "translate(" +
              (width / 2 - levelFactor) +
              ", " +
              (height / 2 - levelFactor) +
              ")"
          );
      }
    },

    makeRadar(options) {
      const that = this;
      const chartData = this.cleanData["chartData"];
      const chart = options.chart;
      const maxValue = options.maxValue;
      const radius = options.radius;
      const radians = options.radians;
      const width = options.width;
      const height = options.height;
      const total = options.total;
      const factor = options.factor;
      const drawOrder = options.drawOrder;
      const cleanData = [];
      const originOrder = [];

      chartData.reduce((acc, v, i) => {
        originOrder[drawOrder(i)] = i;
        cleanData[drawOrder(i)] = v;
      }, []);

      that.tooltipXY = [];

      cleanData.reduce((acc, v, i) => {
        const dataValues = [];

        chart.selectAll(".nodes").data(v, (j, i1) => {
          const xVal =
            width / 2 +
            radius *
              (parseFloat(Math.max(j.value, 0)) / maxValue) *
              factor *
              Math.sin((i1 * radians) / total);
          const yVal =
            height / 2 -
            radius *
              (parseFloat(Math.max(j.value, 0)) / maxValue) *
              factor *
              Math.cos((i1 * radians) / total);

          dataValues.push([xVal, yVal]);
        });
        this.makePolygon(options, dataValues, originOrder[i]);
        this.makePoint(options, v, originOrder[i]);
      }, []);
    },

    /**
     * @description 폴리곤 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     * @param {Array} data 폴리곤 데이터
     * @param {Number} index 폴리곤 인덱스
     */
    makePolygon(options, data, index) {
      const that = this;
      const chart = options.chart;
      const color = options.color;
      const polygonOpacity = options.polygonOpacity;
      const dashArray = options.dashArray;
      const drawOrder = options.drawOrder;
      const isShow = options.isShow;
      const width = options.width;
      const height = options.height;

      chart
        .selectAll(".area")
        .data([data])
        .enter()
        .append("polygon")
        .attr("points", function(d) {
          return d3
            .range(d.length)
            .map(function() {
              return width / 2 + "," + height / 2;
            })
            .join(" ");
        })
        .attr("class", "radar-chart-serie" + index)
        .style("fill-opacity", 0)
        .style("stroke-opacity", 0)
        .style("stroke-width", "2px")
        .style("stroke-dasharray", dashArray(index))
        .style("stroke", color(index))
        .style("fill", () => color(index))
        .transition()
        .duration(1000 * (index + 1))
        .style("stroke-opacity", (d, i) => (isShow(index) ? 1 : 0))
        .style("fill-opacity", (d, i) =>
          isShow(index) ? polygonOpacity(index) : 0
        )
        .attr("points", d => {
          let str = "";
          for (let pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + "," + d[pti][1] + " ";
          }
          return str;
        });
    },

    /**
     * @description 포인트 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     * @param {Array} data 포인트 데이터
     * @param {Number} index 포인트 인덱스
     */
    makePoint(options, data, index) {
      const that = this;
      const chart = options.chart;
      const total = options.total;
      const radius = options.radius;
      const radians = options.radians;
      const maxValue = options.maxValue;
      const factor = options.factor;
      const color = options.color;
      const drawOrder = options.drawOrder;
      const width = options.width;
      const height = options.height;
      const isShow = options.isShow;
      const pointOpacity = options.pointOpacity;

      chart
        .selectAll(".nodes")
        .data(data)
        .enter()
        .append("svg:circle")
        .attr(
          "class",
          d => `radar-chart-serie${index} category-${d["category"]}`
        )
        .attr("r", 5)
        .attr("alt", j => Math.max(j.value, 0))
        .attr("cx", (j, i1) => {
          const x =
            width / 2 +
            radius *
              (Math.max(j.value, 0) / maxValue) *
              factor *
              Math.sin((i1 * radians) / total);
          that.calcTooltipXY({
            x: x,
            index: i1,
            code: j.category
          });
          return x;
        })
        .attr("cy", (j, i1) => {
          const y =
            height / 2 -
            radius *
              (Math.max(j.value, 0) / maxValue) *
              factor *
              Math.cos((i1 * radians) / total);

          that.calcTooltipXY({
            y: y,
            index: i1,
            code: j.category
          });

          return y;
        })
        .attr("data-id", j => j.axis)
        .style("fill", color(index))
        .style("fill-opacity", 0)
        .transition()
        .delay(800 * (index + 1))
        .duration(50 * (index + 1))
        .style("fill-opacity", (d, i) =>
          isShow(index) ? pointOpacity(index) : 0
        );
    },

    calcTooltipXY({ x, y, index, code }) {
      const tooltipXY = this.tooltipXY;
      const tooltip = d3.select(this.$el).select("._tooltip");
      const toolTipWidth = Number(tooltip.style("width").replace("px", "")); // tooltip 너비
      const toolTipHeight = Number(tooltip.style("height").replace("px", "")); // tooltip 높이

      if (!tooltipXY[index]) {
        tooltipXY[index] = { code: code };
      }

      if (!tooltipXY[index]["x"] && x) tooltipXY[index]["x"] = x;
      if (!tooltipXY[index]["y"] && y) tooltipXY[index]["y"] = y;
      if (x) {
        const preX = tooltipXY[index]["x"];
        const containerMarginX = 20;
        let insertX = 0;
        let marginX = containerMarginX;

        // 1, 2, 3, 4, 5 -> x: max
        if ([0, 1, 2, 3, 4, 5, 6].indexOf(index) >= 0) {
          if ([2, 3, 4].indexOf(index) >= 0) {
            marginX = containerMarginX + toolTipWidth / 2 + 40;
            insertX = Math.max(x, preX - marginX) + marginX;
          } else {
            insertX = Math.max(x, preX - marginX) + 23;
          }

          // 7, 8, 9, 10, 11 -> x: min
        } else {
          if ([8, 9, 10].indexOf(index) >= 0) {
            marginX = containerMarginX + toolTipWidth / 2 - 20;
            insertX = Math.min(x, preX + marginX) - marginX;
          } else {
            insertX = Math.min(x, preX + marginX) + 15;
          }
        }

        tooltipXY[index] = Object.assign({}, tooltipXY[index], { x: insertX });
      } else if (y) {
        const preY = tooltipXY[index]["y"];
        let insertY = 0;
        let marginY = 0;

        // 0, 1, 2, 3, 10, 11 -> x: max
        if ([0, 1, 2, 3, 10, 11].indexOf(index) >= 0) {
          if ([11, 0, 1].indexOf(index) >= 0) {
            marginY = toolTipWidth / 2 - 0;
            insertY = Math.min(y, preY + marginY) - marginY;
          } else {
            insertY = Math.min(y, preY + marginY) - 2;
          }

          // 4, 5, 6 ,7 ,8, 9 -> x: min
        } else {
          if ([5, 6, 7].indexOf(index) >= 0) {
            marginY = toolTipHeight / 2 + 40;
            insertY = Math.max(y, preY - marginY) + marginY;
          } else {
            insertY = Math.max(y, preY - marginY) - 5;
          }
        }
        tooltipXY[index] = Object.assign({}, tooltipXY[index], { y: insertY });
      }
    },

    /**
     * @description 툴팁 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeToolTip(options) {
      const chart = options.chart;
      const g = chart
        .append("g")
        .attr("class", "someClass")
        .attr("transform", function(d) {
          return "translate(0,0)";
        })
        .attr("opacity", 0);

      const rect = g
        .append("rect")
        .attr("width", 150)
        .attr("height", 70)
        .style("fill", "white")
        .style("stroke", "blue");

      g.selectAll(".text")
        .data([1, 2, 3])
        .enter()
        .append("text")
        .text(d => d)
        .attr("class", (d, i) => "legend" + (i + 1))
        .attr("x", 10)
        .attr("y", (d, i) => 20 * (i + 1))
        .attr("text-anchor", "start")
        .style("opacity", 1)
        .style("font-size", "13px");

      options.tooltip = g;
    },

    /**
     * @description 마우스 오버 가짜 축 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeFakeAxis(options) {
      const that = this;
      const width = options.width;
      const height = options.height;
      const radius = options.radius;
      const radians = options.radians;
      const factor = options.factor;
      const total = options.total;
      const factorLegend = options.factorLegend;
      const axisData = this.cleanData["axisData"];
      const tooltipData = this.cleanData["tooltipData"];
      const tooltipXY = this["tooltipXY"];

      const element = this.$el;
      const id = this.$dataId;
      const margin = options.margin;

      const chart = d3
        .select(element)
        .select("._fake_container")
        .append("svg")
        .attr("id", Math.floor(Math.random() * 100))
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const axis = chart
        .selectAll(".fakeAxis")
        .data(axisData)
        .enter()
        .append("g")
        .attr("class", "fakeAxis")
        .attr("id", "fakeAxis");

      axis
        .append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", (d, i) => {
          return width / 2 + radius * factor * Math.sin((i * radians) / total);
        })
        .attr("y2", (d, i) => {
          return height / 2 - radius * factor * Math.cos((i * radians) / total);
        })
        .attr("class", "line")
        .style("stroke", "red")
        .style("stroke-width", "8px")
        .style("opacity", 0)
        .on("mouseenter", function(d, i) {
          const tData = tooltipData.filter(item => item.code === d.code)[0];
          const tXY = tooltipXY.filter(item => item.code === d.code)[0];

          // tooltip에 바인딩 될 데이터
          const params = {
            title: `[ ${tData.title} ]`,
            contents: tData.contents,
            color: "black"
          };

          that.$refs["tooltip"].mouseenter(that.$el, params);

          // 현재 마우스오버 위치의 축 안에 포함된 포인트들
          const circle = d3
            .select(that.$el)
            .selectAll(".category-" + d.code)[0];

          for (let i = 0; i < circle.length; i++) {
            const target = circle[i];

            d3.select(target).attr("r", 10);
          }

          d3.select(that.$el)
            .select("._tooltip")
            .style("left", tXY["x"] + "px")
            .style("top", tXY["y"] + "px");
        })
        .on("mouseleave", function(d) {
          const tooltip = d3.select(this.$el).select("._tooltip");
          that.$refs["tooltip"].mouseleave(that.$el);

          // 현재 마우스오버 위치의 축 안에 포함된 포인트들
          const circle = d3.select(that.$el).selectAll(".category-" + d.code);

          for (let i = 0; i < circle[0].length; i++) {
            const target = circle[0][i];

            d3.select(target).attr("r", 5);
          }
        });
    },

    /**
     * @description 폴리곤 마우스오버 리스너
     * @param {Document} target 선택된 엘리먼트
     * @param {Object} options 차트 필수 옵션
     */
    mouseenterPolygon(target, options) {
      const chart = options.chart;
      const z = "polygon." + d3.select(target).attr("class");
      chart
        .selectAll("polygon")
        .transition(200)
        .style("fill-opacity", 0.1);
      chart
        .selectAll(z)
        .transition(200)
        .style("fill-opacity", 0.7);
    },

    /**
     * @description 폴리곤 마우스아웃 리스너
     * @param {Object} options 차트 필수 옵션
     */
    mouseleavePolygon(options) {
      const chart = options.chart;
      const polygonOpacity = options.polygonOpacity;
      chart
        .selectAll("polygon")
        .transition(200)
        .style("fill-opacity", polygonOpacity);
    },

    /**
     * @description 포인트 마우스오버 리스너
     * @param {Document} target 선택된 엘리먼트
     * @param {Object} d 선택된 엘리먼트 바인딩된 데이터
     * @param {Object} options 차트 필수 옵션
     */
    mouseenterPoint(target, d, options) {
      const tooltip = options.tooltip;
      const chart = options.chart;
      const Format = options.Format;
      const newX = parseFloat(d3.select(target).attr("cx")) - 10;
      const newY = parseFloat(d3.select(target).attr("cy")) - 5;
      const z = "polygon." + d3.select(target).attr("class");

      tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(d.colnm + " : " + Format(d.value))
        .transition(200)
        .style("opacity", 1);

      chart
        .selectAll("polygon")
        .transition(200)
        .style("fill-opacity", 0.1);
      chart
        .selectAll(z)
        .transition(200)
        .style("fill-opacity", 0.7);
    },

    /**
     * @description 포인트 마우스아웃 리스너
     * @param {Object} options 차트 필수 옵션
     */
    mouseleavePoint(options) {
      const tooltip = options.tooltip;
      const chart = options.chart;
      const polygonOpacity = options.polygonOpacity;

      tooltip.transition(200).style("opacity", 0);
      chart
        .selectAll("polygon")
        .transition(200)
        .style("fill-opacity", polygonOpacity);
    },

    /**
     * @description 축 마우스오버 리스너
     * @param {Document} target 선택된 엘리먼트
     * @param {Object} d 선택된 엘리먼트 바인딩된 데이터
     * @param {Object} options 차트 필수 옵션
     */
    mouseenterAxis(target, d, options) {
      const tooltip = options.tooltip;
      const chart = options.chart;
      const Format = options.Format;
      const element = d3.select(target);
      const x1 = parseFloat(element.attr("x1"));
      const x2 = parseFloat(element.attr("x2"));
      const y1 = parseFloat(element.attr("y1"));
      const y2 = parseFloat(element.attr("y2"));

      const newX = (x1 + x2) / 2;
      const newY = (y1 + y2) / 2;

      tooltip
        .attr("transform", "translate(" + newX + "," + newY + ")")
        .transition(200)
        .style("opacity", 1);
      tooltip.select(".legend1").text(() => `지수: ${d.idx_value}점`);

      tooltip
        .select(".legend2")
        .text(() => `유사 지자체 지수: ${d.idx_simr_value}점`);
      tooltip.select(".legend3").text(() => `전국 지수: ${d.idx_all_value}점`);
    },

    /**
     * @description 축 마우스아웃 리스너
     * @param {Object} options 차트 필수 옵션
     */
    mouseleaveAxis(options) {
      const tooltip = options.tooltip;
      tooltip.transition(200).style("opacity", 0);
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      d3.select(this.$el)
        .selectAll("svg")
        .remove();
    },

    /**
     * @description 특정 데이터 변경 후 리렌더링 하는 함수
     * @param {Number} dataIndex 변경할 배열데이터 인덱스
     * @param {Object} changedValue 변경할 데이터: code-매핑할 코드, value-값
     * @return {Array}
     */
    changeValue(dataIndex, changedValue) {
      const code = changedValue["code"];
      const value = changedValue["value"];
      const key = changedValue["key"];

      // 변경할 배열 데이터
      const chartData = this.cleanData["chartData"][dataIndex];
      const axisData = this.cleanData["axisData"];
      const tooltipData = this.cleanData["tooltipData"];

      // 코드매핑 후 차트 데이터 변경
      chartData.reduce((acc, v, i) => {
        if (v.category === code) v.value = value;
      }, []);

      // 코드매핑 후 축 데이터 변경
      tooltipData.reduce((acc, v, i) => {
        if (v.code === code) {
          v.contents[dataIndex]["value"] = value;
        }
      }, []);

      return this.cleanData;
    }
  }
};
</script>
<style scoped>
.radar {
  width: 100%;
  height: 100%;
  position: relative;
}

.radar >>> ._default_image ._image {
  width: 150px;
}

.radar >>> ._default_image ._text {
  font-size: 28px;
  bottom: 100px;
}
.radar >>> .radar_legend {
  font-size: 14px;
}
.radar >>> .r_legend {
  font-size: 15px;
}

.radar >>> ._tooltip {
  position: absolute;
}

.radar >>> ._tooltip_container {
  background-color: rgb(235, 235, 235) !important;
}

.radar >>> ._tooltip::after {
  border-style: none !important;
}

.radar >>> ._tooltip ._tooltip_data_block:nth-child(1) ._tooltip_data_name {
  font-weight: bold;
  color: #ff5f2e;
}

.radar >>> ._tooltip ._tooltip_header {
  text-align: center;
}

.radar >>> ._legend {
  position: absolute;
  width: 150px;
  height: auto;
  z-index: 31;
  left: 38px;
  top: 15px;
}

.radar >>> ._legend .r_legend {
  font-size: 15px;
}

.radar >>> ._legend ._box {
  width: 15px;
  height: 15px;
  display: inline-block;
  vertical-align: middle;
}

.radar >>> ._legend_circle {
  cursor: pointer;
}

.radar >>> ._real_container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.radar >>> ._fake_container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 30;
}
</style>