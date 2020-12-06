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

      var json = data;

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

      console.log(height);

      const spacetime = d3.select(element);

      // Space
      const svg = spacetime
        .append("svg")
        .attr("id", id)
        .attr("width", width)
        .attr("height", height)
        // .attr("height", "500px")
        .append("g")
        .attr("transform", "translate(0,0)");
      // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var color = function(group) {
        if (group == 1) {
          return "#aaa";
        } else if (group == 2) {
          return "#fbc280";
        } else {
          return "#405275";
        }
      };

      var force = d3.layout
        .force()
        .gravity(0.1)
        .friction(0.1)
        .distance(100)
        .charge(-800)
        .size([width, height]);

      force
        .nodes(json.nodes)
        .links(json.nodes)
        .start();

      var link = svg
        .selectAll(".link")
        .data(json.nodes)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "black");

      var node = svg
        .selectAll(".node")
        .data(json.nodes)
        .enter()
        .append("g")
        .attr("class", "node");

      node
        .append("circle")
        .attr("r", 13)
        .attr("fill", function(d) {
          return color(d.group);
        });

      node
        .append("text")
        .attr("dx", -18)
        .attr("dy", 8)
        .text(function(d) {
          return d.name;
        });

      force.on("tick", function() {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
        node.attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
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
/* .mindmap-container {
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
} */
.mindmap-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.link {
  stroke: #ccc;
}

.node text {
  pointer-events: none;
  font: 10px sans-serif;
}
</style>