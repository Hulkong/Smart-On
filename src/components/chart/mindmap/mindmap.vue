<template>
  <div class="chart mindmap-container"></div>
</template>

<script>
import { hierarchy, tree } from "d3-hierarchy";
export default {
  name: "mindmap",

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

      // vue 컴포넌트 내장 데이터
      const element = this.$el;
      const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis
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

      const spacetime = d3.select(element);
      const radius = Math.min(width, height);

      const radii = {
        earthOrbit: radius / 2.5,
        earth: radius / 32,
        moonOrbit: radius / 16,
        moon: radius / 96
      };

      // Space
      const svg = spacetime
        .append("svg")
        .attr("id", id)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      // Earth's orbit
      svg
        .append("circle")
        .attr("class", "earthOrbit")
        .attr("r", radii.earthOrbit)
        .style("fill", "none")
        .style("stroke", "rgba(255, 204, 0, 0.25)");

      // Current position of Earth in its orbit
      const earthOrbitPosition = d3.svg
        .arc()
        .outerRadius(radii.earthOrbit + 1)
        .innerRadius(radii.earthOrbit - 1)
        .startAngle(0)
        .endAngle(0);
      svg
        .append("path")
        .attr("class", "earthOrbitPosition")
        .attr("d", earthOrbitPosition)
        .style("fill", "rgba(255, 204, 0, 0.75)");

      const earths = svg
        .selectAll(".earth")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "earth")
        .attr("r", 20)
        .attr("transform", function(d) {
          let transform = "translate(0,0)";
          if (!d.isMax) {
            transform =
              "translate(" +
              radii.earthOrbit *
                Math.sin(d.sin - earthOrbitPosition.startAngle()()) +
              "," +
              -radii.earthOrbit *
                Math.cos(d.cos - earthOrbitPosition.startAngle()()) +
              ")";
          }

          return transform;
        })
        .attr("fill", d => d.color);

      svg
        .selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
          let t = d3.transform(
            d3.select(d3.selectAll(".earth")[0][i]).attr("transform")
          );
          return t.translate[0];
        })
        .attr("y", function(d, i) {
          let t = d3.transform(
            d3.select(d3.selectAll(".earth")[0][i]).attr("transform")
          );
          return t.translate[1];
        })
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .style("font-size", 10)
        .text(function(d, i) {
          return d.name;
        });
    },
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
.mindmap-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
.mindmap-container >>> .node circle {
  cursor: pointer;
  stroke: #3182bd;
  stroke-width: 1.5px;
}

.mindmap-container >>> .node text {
  font: 10px sans-serif;
  pointer-events: none;
  text-anchor: middle;
}

.mindmap-container >>> line.link {
  fill: none;
  stroke: #9ecae1;
  stroke-width: 1.5px;
}
</style>