<template>
  <div class="chart radar">
    <!-- <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>-->
    <!-- <div class="_default_image">
      <v-img
        contain
        width="35%"
        height="35%"
        class="_image"
        :src="getImageUrl('common/img_ready.png')"
        alt
      />
      <p class="_text">준비중입니다.</p>
    </div>-->
    <div class="_real_container"></div>
  </div>
</template>
<script>
export default {
  name: "radar",

  props: {
    options: Object
  },

  data() {
    return {};
  },

  components: {},

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
    },

    /**
     * @description 초기 설정값 세팅하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    init(options) {
      const that = this;
      const margin = options.margin;
      const width =
        Number(
          d3
            .select(this.$el)
            .style("width")
            .replace("px", "")
        ) -
        margin.left -
        margin.right;
      const height =
        Number(
          d3
            .select(this.$el)
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
        .attr("class", "line");

      axis
        .append("text")
        .attr("class", "text radar_legend")
        .text(d => d.name)
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
            factorLegend * Math.sin((i * radians) / total) -
            60 * Math.sin((i * radians) / total); // 기울기
          let x = Math.round(degree / 5);
          // const abs = Math.abs(floor); // 절대값
          // let x = floor > 0 ? -(abs) : (abs); // 양/음 구분
          let floor = Math.floor(Math.abs(degree));
          if (floor == 29) x = x > 0 ? -(Math.abs(x) + 10) : x + 16;
          // if(abs == 3 || floor==2) x=floor*-1;
          // if(i == 0 || i == 6) x = abs;

          const degree_y =
            radius * Math.cos((i * radians) / total) -
            20 * Math.cos((i * radians) / total); // 기울기
          const floor_y = Math.floor(degree_y / 10); // 내림
          let abs_y = Math.abs(floor_y); // 절대값
          let y = floor_y > 0 ? abs_y : -abs_y; // 양/음 구분

          return "translate(" + x + ", " + y + ")";
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
        .attr("class", "tspan")
        .text(d => `${d.text}`)
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
      for (let j = 0; j < levels; j++) {
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

      chartData.reduce((acc, v, i) => {
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
        this.makePolygon(options, dataValues, i);
        this.makePoint(options, v, i);
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
        .attr("class", "polygon radar-chart-serie" + index)
        .transition()
        .duration(1000 * (index + 1))
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
      const width = options.width;
      const height = options.height;
      const r = options.pointWidth;

      chart
        .selectAll(".nodes")
        .data(data)
        .enter()
        .append("svg:circle")
        .attr(
          "class",
          d => `point radar-chart-serie${index} category-${d["category"]}`
        )
        .attr("r", r || 5)
        .attr("alt", j => Math.max(j.value, 0))
        .attr("cx", (j, i1) => {
          const x =
            width / 2 +
            radius *
              (Math.max(j.value, 0) / maxValue) *
              factor *
              Math.sin((i1 * radians) / total);
          return x;
        })
        .attr("cy", (j, i1) => {
          const y =
            height / 2 -
            radius *
              (Math.max(j.value, 0) / maxValue) *
              factor *
              Math.cos((i1 * radians) / total);

          return y;
        })
        .attr("data-id", j => j.axis)
        .style("fill-opacity", 0)
        .transition()
        .delay(800 * (index + 1))
        .duration(50 * (index + 1))
        .style("fill-opacity", 1);
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      d3.select(this.$el)
        .selectAll("svg")
        .remove();
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